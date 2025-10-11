/**
 * Test CoinGecko API
 * Run: node test-coingecko.js
 */

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const REQUEST_TIMEOUT = 30000; // 30 seconds

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

async function testCoinGecko() {
  console.log('='.repeat(60));
  console.log('CoinGecko API Test');
  console.log('='.repeat(60));
  console.log();

  const url = `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin&price_change_percentage=24h`;
  
  console.log('URL:', url);
  console.log('Fetching...');
  console.log();

  try {
    const response = await fetchWithTimeout(url);
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const text = await response.text();
      console.error(`Error response: ${text}`);
      return;
    }
    
    const data = await response.json();
    console.log('Response data:');
    console.log(JSON.stringify(data, null, 2));
    console.log();
    
    console.log('='.repeat(60));
    console.log('PARSED DATA:');
    console.log('='.repeat(60));
    
    for (const coin of data) {
      console.log(`\n${coin.name.toUpperCase()} (${coin.symbol.toUpperCase()})`);
      console.log(`  ID: ${coin.id}`);
      console.log(`  Current Price: $${coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      console.log(`  24h Change: ${coin.price_change_percentage_24h?.toFixed(2)}%`);
      console.log(`  24h High: $${coin.high_24h?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      console.log(`  24h Low: $${coin.low_24h?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    }
    
    console.log();
    console.log('='.repeat(60));
    console.log('TEST PASSED!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.name === 'AbortError') {
      console.error('Request timed out!');
    }
    process.exit(1);
  }
}

testCoinGecko().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

