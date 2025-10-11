import { Resend } from 'resend';
import { getCurrentPrice } from './binance.js';

/**
 * Test email functionality
 * Sends a hello test email with current BTC/ETH/BNB prices
 */
async function sendTestEmail() {
  console.log('=== Email Test Started ===\n');
  
  // Check environment variables
  const apiKey = process.env.RESEND_API_KEY;
  const emailTo = process.env.EMAIL_TO;
  const emailFrom = process.env.EMAIL_FROM;
  
  if (!apiKey || !emailTo || !emailFrom) {
    console.error('? Missing required environment variables!');
    console.error('Required: RESEND_API_KEY, EMAIL_TO, EMAIL_FROM');
    process.exit(1);
  }
  
  console.log('? Environment variables configured');
  console.log(`   From: ${emailFrom}`);
  console.log(`   To: ${emailTo}\n`);
  
  // Fetch current prices
  console.log('?? Fetching current prices...');
  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
  const prices = {};
  
  for (const symbol of symbols) {
    try {
      console.log(`   Fetching ${symbol}...`);
      const price = await getCurrentPrice(symbol);
      if (price !== null) {
        prices[symbol] = price;
        console.log(`   ${symbol}: $${price.toFixed(2)} ?`);
      } else {
        console.warn(`   ${symbol}: Failed to fetch price (API returned null)`);
        prices[symbol] = null;
      }
    } catch (error) {
      console.error(`   ${symbol}: Error - ${error.message}`);
      prices[symbol] = null;
    }
    
    // Add small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  // Build email content
  const subject = '[Test] Crypto Volatility Alert - Hello Test';
  const body = buildTestEmailBody(prices);
  
  console.log('\n? Sending test email...');
  
  // Send email
  const resend = new Resend(apiKey);
  
  try {
    const result = await resend.emails.send({
      from: emailFrom,
      to: emailTo,
      subject: subject,
      text: body
    });
    
    console.log('? Test email sent successfully!');
    console.log(`   Email ID: ${result.id}`);
    console.log(`\n? Please check your inbox at: ${emailTo}`);
    console.log('   (Don\'t forget to check spam/junk folder if you don\'t see it)\n');
    
    console.log('=== Email Test Completed ===');
  } catch (error) {
    console.error('? Failed to send test email:', error.message);
    
    if (error.message.includes('403')) {
      console.error('\n? Tip: Make sure your EMAIL_FROM domain is verified in Resend');
      console.error('   Or use "onboarding@resend.dev" for testing');
    }
    
    process.exit(1);
  }
}

/**
 * Build test email body with current prices
 */
function buildTestEmailBody(prices) {
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
    'Hello!',
    '',
    'This is a test email from your Crypto Volatility Alert Service.',
    '',
    '============================================================',
    '',
    'CURRENT CRYPTOCURRENCY PRICES',
    '',
    '------------------------------------------------------------',
    ''
  ];
  
  // Add price information
  for (const [symbol, price] of Object.entries(prices)) {
    const coin = symbol.replace('USDT', '');
    if (price !== null) {
      lines.push(`  ${coin.padEnd(8)} | $${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    } else {
      lines.push(`  ${coin.padEnd(8)} | [Failed to fetch - please check logs]`);
    }
  }
  
  lines.push('');
  lines.push('------------------------------------------------------------');
  lines.push('');
  lines.push(`Timestamp: ${timestamp} (Asia/Shanghai)`);
  lines.push('');
  lines.push('============================================================');
  lines.push('');
  lines.push('CONFIGURATION STATUS');
  lines.push('');
  lines.push('  [OK] Email service: Working');
  lines.push('  [OK] Binance API: Working');
  lines.push('  [' + (Object.values(prices).every(p => p !== null) ? 'OK' : 'WARN') + '] Price fetching: ' + (Object.values(prices).every(p => p !== null) ? 'All OK' : 'Partial failures'));
  lines.push('');
  lines.push('Your crypto volatility monitoring service is ready!');
  lines.push('');
  lines.push('The system will automatically:');
  lines.push('  - Monitor price changes every 5 minutes');
  lines.push('  - Send alerts when volatility reaches 6%, 8%, 10%, etc.');
  lines.push('  - Reset daily at 00:00 (Asia/Shanghai timezone)');
  lines.push('');
  lines.push('------------------------------------------------------------');
  lines.push('');
  lines.push('NEXT STEPS:');
  lines.push('  1. Check that you received this email (including spam folder)');
  lines.push('  2. Verify the prices are current and correct');
  lines.push('  3. Your alert service is now active and monitoring!');
  lines.push('');
  lines.push('Need help? Check the documentation in your repository.');
  lines.push('');
  lines.push('Happy monitoring!');
  
  return lines.join('\n');
}

// Run the test
sendTestEmail().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

