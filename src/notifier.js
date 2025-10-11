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

