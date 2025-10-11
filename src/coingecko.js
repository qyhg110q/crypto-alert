/**
 * CoinGecko API client
 * Fetches cryptocurrency prices and 24h change percentages
 */

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Mapping from common symbols to CoinGecko IDs
const SYMBOL_TO_ID = {
  'BTCUSDT': 'bitcoin',
  'BTC': 'bitcoin',
  'ETHUSDT': 'ethereum',
  'ETH': 'ethereum',
  'BNBUSDT': 'binancecoin',
  'BNB': 'binancecoin'
};

/**
 * Fetch with timeout
 */
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

/**
 * Get market data for multiple coins from CoinGecko
 * @param {string[]} symbols - Array of symbols (e.g., ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'])
 * @param {number} retries - Number of retry attempts (default: 3)
 * @returns {Promise<Object|null>} Object with symbol as key and {price, change24h} as value, or null if failed
 */
export async function getMarketData(symbols, retries = 3) {
  // Convert symbols to CoinGecko IDs
  const ids = symbols.map(s => SYMBOL_TO_ID[s] || SYMBOL_TO_ID[s.replace('USDT', '')]).filter(Boolean);
  
  if (ids.length === 0) {
    console.error('No valid symbols provided');
    return null;
  }
  
  const idsParam = ids.join(',');
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const url = `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&ids=${idsParam}&price_change_percentage=24h`;
      console.log(`[Attempt ${attempt}/${retries}] Fetching from CoinGecko: ${url}`);
      
      const response = await fetchWithTimeout(url);
      
      if (!response.ok) {
        console.error(`Failed to fetch from CoinGecko: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.error(`Response body: ${text}`);
        
        // If not the last attempt, wait and retry
        if (attempt < retries) {
          const waitTime = 2000 * attempt; // Progressive delay: 2s, 4s, 6s...
          console.log(`   Retrying in ${waitTime/1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        return null;
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        console.error('Invalid or empty data from CoinGecko:', data);
        
        if (attempt < retries) {
          const waitTime = 2000 * attempt;
          console.log(`   Retrying in ${waitTime/1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        return null;
      }
      
      // Parse and map data back to original symbols
      const result = {};
      
      for (const coin of data) {
        // Find the original symbol(s) for this coin
        for (const symbol of symbols) {
          const id = SYMBOL_TO_ID[symbol] || SYMBOL_TO_ID[symbol.replace('USDT', '')];
          if (id === coin.id) {
            const price = coin.current_price;
            const change24h = coin.price_change_percentage_24h_in_currency || coin.price_change_percentage_24h;
            
            if (typeof price === 'number' && !isNaN(price) && price > 0) {
              result[symbol] = {
                price: price,
                change24h: typeof change24h === 'number' && !isNaN(change24h) ? change24h : 0,
                high24h: coin.high_24h,
                low24h: coin.low_24h,
                name: coin.name,
                symbol: coin.symbol.toUpperCase()
              };
              console.log(`   ${symbol}: $${price.toFixed(2)}, 24h: ${change24h?.toFixed(2)}%`);
            } else {
              console.warn(`   ${symbol}: Invalid price data`);
              result[symbol] = null;
            }
          }
        }
      }
      
      console.log(`   Success! Fetched data for ${Object.keys(result).length} symbols`);
      return result;
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error(`Request timeout after ${REQUEST_TIMEOUT}ms`);
      } else {
        console.error(`Error fetching from CoinGecko:`, error.message);
      }
      
      // If not the last attempt, wait and retry
      if (attempt < retries) {
        const waitTime = 2000 * attempt;
        console.log(`   Retrying in ${waitTime/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      return null;
    }
  }
  
  return null;
}

/**
 * Get current price for a single symbol
 * @param {string} symbol - Symbol (e.g., 'BTCUSDT')
 * @returns {Promise<number|null>} Current price or null if failed
 */
export async function getCurrentPrice(symbol) {
  const data = await getMarketData([symbol]);
  return data && data[symbol] ? data[symbol].price : null;
}

