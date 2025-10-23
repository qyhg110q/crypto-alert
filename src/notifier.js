import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send email notification via Resend
 * @param {object[]} triggers - Array of trigger objects
 * @param {string} date - Date string
 * @returns {Promise<boolean>} Success status
 */
export async function sendNotification(triggers, date) {
  if (!triggers || triggers.length === 0) {
    return true;
  }
  
  const emailTo = process.env.EMAIL_TO;
  const emailFrom = process.env.EMAIL_FROM;
  
  if (!emailTo || !emailFrom) {
    console.error('EMAIL_TO or EMAIL_FROM not configured');
    return false;
  }
  
  const subject = buildSubject(triggers, date);
  const body = buildBody(triggers);
  
  try {
    const result = await resend.emails.send({
      from: emailFrom,
      to: emailTo,
      subject: subject,
      text: body
    });
    
    console.log('Email sent successfully:', result.id);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error.message);
    return false;
  }
}

/**
 * Send hyperdash fills email
 * @param {Record<string, Array<object>>} addressToFills - map of address -> fills[]
 * @returns {Promise<boolean>}
 */
export async function sendHyperdashFillsEmail(addressToFills) {
  const emailTo = process.env.EMAIL_TO;
  const emailFrom = process.env.EMAIL_FROM;
  if (!emailTo || !emailFrom) {
    console.error('EMAIL_TO or EMAIL_FROM not configured');
    return false;
  }

  const total = Object.values(addressToFills).reduce((acc, arr) => acc + (arr?.length || 0), 0);
  if (total === 0) return true;

  const subject = `[Hyperdash Fills] ${total} new fills across ${Object.keys(addressToFills).length} address(es)`;
  const body = buildFillsBody(addressToFills);

  try {
    const result = await resend.emails.send({ from: emailFrom, to: emailTo, subject, text: body });
    console.log('Fills email sent:', result.id);
    return true;
  } catch (e) {
    console.error('Failed to send fills email:', e.message);
    return false;
  }
}

function buildFillsBody(addressToFills) {
  const timestamp = new Date().toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  const lines = [
    'Hyperdash User Fills',
    '='.repeat(60),
    ''
  ];

  for (const [address, fills] of Object.entries(addressToFills)) {
    if (!fills || fills.length === 0) continue;
    lines.push(`Address: ${address}`);
    lines.push('------------------------------------------------------------');
    for (const f of fills.sort((a,b)=>a.timestamp-b.timestamp)) {
      const when = new Date(f.timestamp).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
      const side = (f.side || '').toUpperCase();
      const sym = (f.symbol || '').toUpperCase();
      lines.push(`  ${when}  ${sym.padEnd(8)}  ${side.padEnd(4)}  px=$${(f.price||0).toFixed(4)}  sz=${f.size}`);
    }
    lines.push('');
  }

  lines.push('='.repeat(60));
  lines.push('');
  lines.push(`Timestamp: ${timestamp} (Asia/Shanghai)`);
  lines.push('');
  lines.push('This is an automated notification for Hyperdash user fills.');
  return lines.join('\n');
}

/**
 * Build email subject line
 * @param {object[]} triggers - Array of trigger objects
 * @param {string} date - Date string
 * @returns {string} Subject line
 */
function buildSubject(triggers, date) {
  // Find the highest threshold
  const maxThreshold = Math.max(...triggers.map(t => t.threshold));
  
  // Determine direction (Up/Down/Mixed)
  const directions = new Set(triggers.map(t => t.pct > 0 ? 'Up' : 'Down'));
  const direction = directions.size === 1 ? Array.from(directions)[0] : 'Mixed';
  
  return `[Volatility Alert] Reached ${maxThreshold}% (24h) (${direction}) - ${date}`;
}

/**
 * Build email body
 * @param {object[]} triggers - Array of trigger objects
 * @returns {string} Email body text
 */
function buildBody(triggers) {
  const timestamp = new Date().toLocaleString('zh-CN', { 
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  const lines = [
    'Crypto Volatility Alert',
    '='.repeat(60),
    ''
  ];
  
  // Add alert details
  for (const trigger of triggers) {
    const sign = trigger.pct >= 0 ? '+' : '';
    const line = `${trigger.symbol} hit ${trigger.threshold}% threshold (24h change: ${sign}${trigger.pct.toFixed(2)}%, current price: $${trigger.price.toFixed(2)})`;
    lines.push(line);
  }
  
  lines.push('');
  lines.push('------------------------------------------------------------');
  lines.push('');
  lines.push('CURRENT PRICES & 24H RANGES:');
  lines.push('');
  
  // Group triggers by symbol to show unique prices
  const symbolData = new Map();
  for (const trigger of triggers) {
    if (!symbolData.has(trigger.symbol)) {
      symbolData.set(trigger.symbol, {
        price: trigger.price,
        pct: trigger.pct,
        high24h: trigger.high24h,
        low24h: trigger.low24h,
        name: trigger.name
      });
    }
  }
  
  // Display current prices and 24h range
  for (const [symbol, data] of symbolData) {
    const coin = symbol.replace('USDT', '');
    const sign = data.pct >= 0 ? '+' : '';
    lines.push(`  ${coin.padEnd(8)} | $${data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${sign}${data.pct.toFixed(2)}% in 24h)`);
    if (data.high24h && data.low24h) {
      lines.push(`             24h range: $${data.low24h.toFixed(2)} - $${data.high24h.toFixed(2)}`);
    }
  }
  
  lines.push('');
  lines.push('------------------------------------------------------------');
  lines.push('');
  lines.push(`Timestamp: ${timestamp} (Asia/Shanghai)`);
  lines.push('');
  lines.push('='.repeat(60));
  lines.push('');
  lines.push('This is an automated alert from your crypto volatility monitoring service.');
  lines.push('The system monitors 24-hour price changes every 5 minutes using CoinGecko API.');
  
  return lines.join('\n');
}

/**
 * Send email notification for position changes
 * @param {string} address - Address
 * @param {object} changes - { added: [], removed: [], changed: [] }
 * @returns {Promise<boolean>}
 */
export async function sendPositionChangeEmail(address, changes) {
  const emailTo = process.env.EMAIL_TO;
  const emailFrom = process.env.EMAIL_FROM;

  if (!emailTo || !emailFrom) {
    console.error('[notifier] EMAIL_TO or EMAIL_FROM not configured');
    return false;
  }

  const total = changes.added.length + changes.removed.length + changes.changed.length;
  if (total === 0) return true; // No changes, no email

  const subject = buildPositionSubject(address, changes);
  const body = buildPositionBody(address, changes);

  try {
    const result = await resend.emails.send({
      from: emailFrom,
      to: emailTo,
      subject: subject,
      text: body
    });
    console.log('[notifier] Position email sent:', result.id);
    return true;
  } catch (err) {
    console.error('[notifier] Failed to send position email:', err.message);
    return false;
  }
}

function buildPositionSubject(address, changes) {
  const parts = [];
  if (changes.added.length > 0) parts.push(`${changes.added.length} opened`);
  if (changes.removed.length > 0) parts.push(`${changes.removed.length} closed`);
  if (changes.changed.length > 0) parts.push(`${changes.changed.length} changed`);
  const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;
  return `[Hyperdash Position] ${parts.join(', ')} - ${shortAddr}`;
}

function buildPositionBody(address, changes) {
  const timestamp = new Date().toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const lines = [
    'Hyperdash Position Changes Alert',
    '='.repeat(60),
    '',
    `Address: ${address}`,
    `Time: ${timestamp} (Asia/Shanghai)`,
    ''
  ];

  // New positions
  if (changes.added.length > 0) {
    lines.push('NEW POSITIONS OPENED:');
    lines.push('-'.repeat(60));
    changes.added.forEach(p => {
      lines.push(`  ${p.coin}`);
      lines.push(`    Size: ${p.szi > 0 ? 'LONG' : 'SHORT'} ${Math.abs(p.szi).toFixed(4)} contracts`);
      lines.push(`    Position Value: $${Math.abs(p.positionValue).toFixed(2)}`);
      lines.push(`    Entry Price: $${p.entryPx.toFixed(4)}`);
      lines.push(`    Unrealized PnL: $${p.unrealizedPnl.toFixed(2)}`);
      if (p.liquidationPx) {
        lines.push(`    Liquidation Price: $${p.liquidationPx.toFixed(4)}`);
      }
      lines.push(`    Leverage: ${p.leverage.toFixed(1)}x (${p.leverageType})`);
      lines.push('');
    });
  }

  // Closed positions
  if (changes.removed.length > 0) {
    lines.push('POSITIONS CLOSED:');
    lines.push('-'.repeat(60));
    changes.removed.forEach(p => {
      lines.push(`  ${p.coin}`);
      lines.push(`    Closed Size: ${p.szi > 0 ? 'LONG' : 'SHORT'} ${Math.abs(p.szi).toFixed(4)} contracts`);
      lines.push(`    Last Value: $${Math.abs(p.positionValue).toFixed(2)}`);
      lines.push(`    Entry Price: $${p.entryPx.toFixed(4)}`);
      lines.push(`    Final PnL: $${p.unrealizedPnl.toFixed(2)}`);
      lines.push('');
    });
  }

  // Changed positions
  if (changes.changed.length > 0) {
    lines.push('POSITIONS CHANGED:');
    lines.push('-'.repeat(60));
    changes.changed.forEach(({ old, new: newPos }) => {
      lines.push(`  ${newPos.coin}`);
      
      // Size change
      if (old.szi !== newPos.szi) {
        const oldDir = old.szi > 0 ? 'LONG' : 'SHORT';
        const newDir = newPos.szi > 0 ? 'LONG' : 'SHORT';
        const sizeDiff = newPos.szi - old.szi;
        const sizeChangeSign = sizeDiff > 0 ? '+' : '';
        lines.push(`    Size: ${oldDir} ${Math.abs(old.szi).toFixed(4)} -> ${newDir} ${Math.abs(newPos.szi).toFixed(4)} (${sizeChangeSign}${sizeDiff.toFixed(4)})`);
      }
      
      // Position value change
      if (Math.abs(old.positionValue - newPos.positionValue) > 0.01) {
        const valueDiff = newPos.positionValue - old.positionValue;
        const valueChangeSign = valueDiff > 0 ? '+' : '';
        lines.push(`    Value: $${Math.abs(old.positionValue).toFixed(2)} -> $${Math.abs(newPos.positionValue).toFixed(2)} (${valueChangeSign}$${valueDiff.toFixed(2)})`);
      }
      
      // Entry price change (averaging)
      if (Math.abs(old.entryPx - newPos.entryPx) > 0.0001) {
        lines.push(`    Entry Px: $${old.entryPx.toFixed(4)} -> $${newPos.entryPx.toFixed(4)}`);
      }
      
      lines.push(`    Current PnL: $${newPos.unrealizedPnl.toFixed(2)}`);
      if (newPos.liquidationPx) {
        lines.push(`    Liquidation Px: $${newPos.liquidationPx.toFixed(4)}`);
      }
      lines.push(`    Leverage: ${newPos.leverage.toFixed(1)}x (${newPos.leverageType})`);
      lines.push('');
    });
  }

  lines.push('='.repeat(60));
  lines.push('');
  lines.push('This is an automated notification for Hyperdash position changes.');
  lines.push('It monitors your Hyperliquid positions every 5 minutes.');

  return lines.join('\n');
}

