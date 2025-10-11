/**
 * Configuration Test Script
 * 
 * This script helps verify that your environment is set up correctly
 * before deploying to GitHub Actions.
 * 
 * Usage: node test-config.js
 */

import { Resend } from 'resend';

console.log('=== Configuration Test ===\n');

// Check environment variables
const checks = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_TO: process.env.EMAIL_TO,
  EMAIL_FROM: process.env.EMAIL_FROM,
  SYMBOLS: process.env.SYMBOLS || 'BTCUSDT,ETHUSDT,BNBUSDT (default)'
};

console.log('1. Environment Variables:');
for (const [key, value] of Object.entries(checks)) {
  const status = value ? '?' : '?';
  const display = value ? (key === 'RESEND_API_KEY' ? value.substring(0, 10) + '...' : value) : 'NOT SET';
  console.log(`   ${status} ${key}: ${display}`);
}

// Check if all required variables are set
const allSet = checks.RESEND_API_KEY && checks.EMAIL_TO && checks.EMAIL_FROM;

if (!allSet) {
  console.log('\n? Missing required environment variables!');
  console.log('   Please create a .env file based on .env.example');
  process.exit(1);
}

console.log('\n2. Testing Binance API...');
try {
  const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
  if (response.ok) {
    const data = await response.json();
    console.log(`   ? Binance API accessible (BTCUSDT: $${parseFloat(data.price).toFixed(2)})`);
  } else {
    console.log(`   ? Binance API returned status ${response.status}`);
  }
} catch (error) {
  console.log(`   ? Failed to connect to Binance API: ${error.message}`);
}

console.log('\n3. Testing Resend API...');
const resend = new Resend(process.env.RESEND_API_KEY);

try {
  // Try to send a test email
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: '[Test] Crypto Volatility Alert Configuration Test',
    text: `This is a test email from your crypto volatility alert service.

If you received this email, your configuration is correct!

Configuration details:
- From: ${process.env.EMAIL_FROM}
- To: ${process.env.EMAIL_TO}
- Monitoring: ${checks.SYMBOLS}

You can now deploy to GitHub Actions.`
  });
  
  console.log(`   ? Test email sent successfully (ID: ${result.id})`);
  console.log(`   ? Check your inbox at ${process.env.EMAIL_TO}`);
} catch (error) {
  console.log(`   ? Failed to send email: ${error.message}`);
  
  if (error.message.includes('403')) {
    console.log('\n   ? Tip: Make sure your EMAIL_FROM domain is verified in Resend');
    console.log('      Or use "onboarding@resend.dev" for testing');
  }
  
  if (error.message.includes('API key')) {
    console.log('\n   ? Tip: Check that your RESEND_API_KEY is correct');
    console.log('      Get it from https://resend.com/api-keys');
  }
  
  process.exit(1);
}

console.log('\n=== All Tests Passed! ===');
console.log('Your configuration is ready for deployment to GitHub Actions.\n');

