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
  
  return `[Volatility Alert] Reached ${maxThreshold}% intraday (${direction}) - ${date}`;
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
    const direction = trigger.pct >= 0 ? 'UP' : 'DOWN';
    const line = `${trigger.symbol} hit ${trigger.threshold}% threshold (now ${sign}${trigger.pct.toFixed(2)}%, price $${trigger.price.toFixed(2)}, open $${trigger.openPrice.toFixed(2)})`;
    lines.push(line);
  }
  
  lines.push('');
  lines.push('------------------------------------------------------------');
  lines.push('');
  lines.push('CURRENT PRICES:');
  lines.push('');
  
  // Group triggers by symbol to show unique prices
  const symbolPrices = new Map();
  for (const trigger of triggers) {
    if (!symbolPrices.has(trigger.symbol)) {
      symbolPrices.set(trigger.symbol, {
        price: trigger.price,
        openPrice: trigger.openPrice,
        pct: trigger.pct
      });
    }
  }
  
  // Display current prices
  for (const [symbol, data] of symbolPrices) {
    const coin = symbol.replace('USDT', '');
    const sign = data.pct >= 0 ? '+' : '';
    lines.push(`  ${coin.padEnd(8)} | $${data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${sign}${data.pct.toFixed(2)}% from open $${data.openPrice.toFixed(2)})`);
  }
  
  lines.push('');
  lines.push('------------------------------------------------------------');
  lines.push('');
  lines.push(`Timestamp: ${timestamp} (Asia/Shanghai)`);
  lines.push('');
  lines.push('='.repeat(60));
  lines.push('');
  lines.push('This is an automated alert from your crypto volatility monitoring service.');
  lines.push('The system monitors price changes every 5 minutes and resets daily at 00:00.');
  
  return lines.join('\n');
}

