const BINANCE_API_BASE = 'https://api.binance.com';
const REQUEST_TIMEOUT = 10000; // 10 seconds

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
 * Get current price for a symbol from Binance with retry
 * @param {string} symbol - Trading pair symbol (e.g., 'BTCUSDT')
 * @param {number} retries - Number of retry attempts (default: 2)
 * @returns {Promise<number|null>} Current price or null if failed
 */
export async function getCurrentPrice(symbol, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const url = `${BINANCE_API_BASE}/api/v3/ticker/price?symbol=${symbol}`;
      console.log(`[Attempt ${attempt}/${retries}] Fetching price from: ${url}`);
      
      const response = await fetchWithTimeout(url);
      
      if (!response.ok) {
        console.error(`Failed to fetch price for ${symbol}: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.error(`Response body: ${text}`);
        
        // If not the last attempt, wait and retry
        if (attempt < retries) {
          console.log(`   Retrying in 1 second...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        return null;
      }
      
      const data = await response.json();
      
      if (!data || !data.price) {
        console.error(`Invalid data format for ${symbol}:`, data);
        
        if (attempt < retries) {
          console.log(`   Retrying in 1 second...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        return null;
      }
      
      const price = parseFloat(data.price);
      if (isNaN(price) || price <= 0) {
        console.error(`Invalid price value for ${symbol}: ${data.price}`);
        
        if (attempt < retries) {
          console.log(`   Retrying in 1 second...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        return null;
      }
      
      console.log(`   Success! ${symbol} = $${price.toFixed(2)}`);
      return price;
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error(`Request timeout for ${symbol} after ${REQUEST_TIMEOUT}ms`);
      } else {
        console.error(`Error fetching price for ${symbol}:`, error.message);
      }
      
      // If not the last attempt, wait and retry
      if (attempt < retries) {
        console.log(`   Retrying in 1 second...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      return null;
    }
  }
  
  return null;
}

/**
 * Get the opening price at local midnight (first 1m candle after startMs)
 * @param {string} symbol - Trading pair symbol (e.g., 'BTCUSDT')
 * @param {number} startMs - Start timestamp in milliseconds
 * @returns {Promise<number|null>} Opening price or null if failed
 */
export async function getOpenPriceAtLocalMidnight(symbol, startMs) {
  try {
    const url = `${BINANCE_API_BASE}/api/v3/klines?symbol=${symbol}&interval=1m&startTime=${startMs}&limit=1`;
    console.log(`Fetching klines from: ${url}`);
    
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch klines for ${symbol}: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error(`Response body: ${text}`);
      return null;
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      console.error(`No kline data returned for ${symbol}`);
      return null;
    }
    
    // Kline format: [openTime, open, high, low, close, volume, ...]
    const openPrice = parseFloat(data[0][1]);
    
    if (isNaN(openPrice) || openPrice <= 0) {
      console.error(`Invalid open price value for ${symbol}: ${data[0][1]}`);
      return null;
    }
    
    return openPrice;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`Request timeout for ${symbol} klines after ${REQUEST_TIMEOUT}ms`);
    } else {
      console.error(`Error fetching klines for ${symbol}:`, error.message);
    }
    return null;
  }
}

