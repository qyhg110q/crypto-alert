const BINANCE_API_BASE = 'https://api.binance.com';

/**
 * Get current price for a symbol from Binance
 * @param {string} symbol - Trading pair symbol (e.g., 'BTCUSDT')
 * @returns {Promise<number|null>} Current price or null if failed
 */
export async function getCurrentPrice(symbol) {
  try {
    const url = `${BINANCE_API_BASE}/api/v3/ticker/price?symbol=${symbol}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch price for ${symbol}: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error.message);
    return null;
  }
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
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch klines for ${symbol}: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      console.error(`No kline data returned for ${symbol}`);
      return null;
    }
    
    // Kline format: [openTime, open, high, low, close, volume, ...]
    const openPrice = parseFloat(data[0][1]);
    return openPrice;
  } catch (error) {
    console.error(`Error fetching klines for ${symbol}:`, error.message);
    return null;
  }
}

