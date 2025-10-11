/**
 * Quick test script to verify Binance API connection
 * Run: node test-price.js
 */

const BINANCE_API_BASE = 'https://api.binance.com';
const REQUEST_TIMEOUT = 10000; // 10 seconds

async function fetchWithTimeout(url, timeout = REQUEST_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function testPrice(symbol) {
  console.log(`\n=== Testing ${symbol} ===`);
  
  try {
    const url = `${BINANCE_API_BASE}/api/v3/ticker/price?symbol=${symbol}`;
    console.log(`URL: ${url}`);
    console.log('Fetching...');
    
    const response = await fetchWithTimeout(url);
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const text = await response.text();
      console.error(`Error response: ${text}`);
      return null;
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (data && data.price) {
      const price = parseFloat(data.price);
      console.log(`? Success! Price: $${price.toFixed(2)}`);
      return price;
    } else {
      console.error('Invalid data format:', data);
      return null;
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.name === 'AbortError') {
      console.error('Request timed out!');
    }
    return null;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('Binance API Price Fetching Test');
  console.log('='.repeat(60));
  
  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
  const results = {};
  
  for (const symbol of symbols) {
    const price = await testPrice(symbol);
    results[symbol] = price;
    
    // Wait 500ms between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  
  for (const [symbol, price] of Object.entries(results)) {
    const status = price !== null ? '? OK' : '? FAILED';
    const priceStr = price !== null ? `$${price.toFixed(2)}` : 'N/A';
    console.log(`${symbol.padEnd(10)} ${status.padEnd(10)} ${priceStr}`);
  }
  
  console.log('='.repeat(60));
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

