import { Resend } from 'resend';
import { getMarketData } from './coingecko.js';

/**
 * Test email functionality
 * Sends a hello test email with current BTC/ETH/BNB prices from CoinGecko
 */
async function sendTestEmail() {
  console.log('=== Email Test Started ===\n');
  
  // Check environment variables
  const apiKey = process.env.RESEND_API_KEY;
  const emailTo = process.env.EMAIL_TO;
  const emailFrom = process.env.EMAIL_FROM;
  
  if (!apiKey || !emailTo || !emailFrom) {
    console.error('[ERROR] Missing required environment variables!');
    console.error('Required: RESEND_API_KEY, EMAIL_TO, EMAIL_FROM');
    process.exit(1);
  }
  
  console.log('[OK] Environment variables configured');
  console.log(`   From: ${emailFrom}`);
  console.log(`   To: ${emailTo}\n`);
  
  // Fetch current prices from CoinGecko
  console.log('[INFO] Fetching current prices from CoinGecko...');
  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
  
  const marketData = await getMarketData(symbols);
  
  if (!marketData) {
    console.error('[ERROR] Failed to fetch market data from CoinGecko');
    process.exit(1);
  }
  
  console.log('[OK] Market data fetched successfully\n');
  
  // Build email content
  const subject = '[Test] Crypto Volatility Alert - Hello Test (CoinGecko)';
  const body = buildTestEmailBody(marketData);
  
  console.log('[INFO] Sending test email...');
  
  // Send email
  const resend = new Resend(apiKey);
  
  try {
    const result = await resend.emails.send({
      from: emailFrom,
      to: emailTo,
      subject: subject,
      text: body
    });
    
    console.log('[OK] Test email sent successfully!');
    console.log(`   Email ID: ${result.id}`);
    console.log(`\n[INFO] Please check your inbox at: ${emailTo}`);
    console.log('   (Don\'t forget to check spam/junk folder if you don\'t see it)\n');
    
    console.log('=== Email Test Completed ===');
  } catch (error) {
    console.error('[ERROR] Failed to send test email:', error.message);
    
    if (error.message.includes('403')) {
      console.error('\n[TIP] Make sure your EMAIL_FROM domain is verified in Resend');
      console.error('   Or use "onboarding@resend.dev" for testing');
    }
    
    process.exit(1);
  }
}

/**
 * Build test email body with current prices from CoinGecko
 */
function buildTestEmailBody(marketData) {
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
    'Now using CoinGecko API for better reliability!',
    '',
    '============================================================',
    '',
    'CURRENT CRYPTOCURRENCY PRICES',
    '',
    '------------------------------------------------------------',
    ''
  ];
  
  // Add price information
  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
  for (const symbol of symbols) {
    const coin = symbol.replace('USDT', '');
    const data = marketData[symbol];
    
    if (data && data.price) {
      const sign = data.change24h >= 0 ? '+' : '';
      lines.push(`  ${coin.padEnd(8)} | $${data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      lines.push(`             24h change: ${sign}${data.change24h.toFixed(2)}%`);
      if (data.high24h && data.low24h) {
        lines.push(`             24h range: $${data.low24h.toFixed(2)} - $${data.high24h.toFixed(2)}`);
      }
      lines.push('');
    } else {
      lines.push(`  ${coin.padEnd(8)} | [Failed to fetch - please check logs]`);
      lines.push('');
    }
  }
  
  lines.push('------------------------------------------------------------');
  lines.push('');
  lines.push(`Timestamp: ${timestamp} (Asia/Shanghai)`);
  lines.push('');
  lines.push('============================================================');
  lines.push('');
  lines.push('CONFIGURATION STATUS');
  lines.push('');
  lines.push('  [OK] Email service: Working');
  lines.push('  [OK] CoinGecko API: Working');
  
  const allOk = symbols.every(s => marketData[s] && marketData[s].price);
  lines.push('  [' + (allOk ? 'OK' : 'WARN') + '] Price fetching: ' + (allOk ? 'All OK' : 'Partial failures'));
  
  lines.push('');
  lines.push('Your crypto volatility monitoring service is ready!');
  lines.push('');
  lines.push('The system will automatically:');
  lines.push('  - Monitor 24-hour price changes every 5 minutes');
  lines.push('  - Send alerts when volatility reaches 6%, 8%, 10%, etc.');
  lines.push('  - Use CoinGecko API for reliable data access');
  lines.push('  - Reset thresholds daily at 00:00 (Asia/Shanghai timezone)');
  lines.push('');
  lines.push('------------------------------------------------------------');
  lines.push('');
  lines.push('WHAT CHANGED:');
  lines.push('  - Switched from Binance to CoinGecko API');
  lines.push('  - Now monitors 24-hour percentage changes');
  lines.push('  - Better compatibility with GitHub Actions');
  lines.push('  - More reliable price data fetching');
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
