import { getLocalDateStr } from './time.js';
import { getMarketData } from './coingecko.js';
import { readState, writeState, createInitialStateFor24h } from './state.js';
import { sendNotification } from './notifier.js';

// Configuration
const TIMEZONE = 'Asia/Shanghai';
const INITIAL_THRESHOLD = 6;
const THRESHOLD_STEP = 2;

/**
 * Main execution function
 * Now using CoinGecko API with 24h percentage changes
 */
async function main() {
  console.log('=== Crypto Volatility Monitor Started ===');
  console.log('Using CoinGecko API for 24h price changes');
  
  // Get symbols from environment or use defaults
  const symbolsStr = process.env.SYMBOLS || 'BTCUSDT,ETHUSDT,BNBUSDT';
  const symbols = symbolsStr.split(',').map(s => s.trim()).filter(s => s);
  
  console.log(`Monitoring symbols: ${symbols.join(', ')}`);
  
  // Get current date
  const currentDate = getLocalDateStr(TIMEZONE);
  console.log(`Current date (${TIMEZONE}): ${currentDate}`);
  
  // Fetch current market data from CoinGecko
  console.log('\nFetching market data from CoinGecko...');
  const marketData = await getMarketData(symbols);
  
  if (!marketData) {
    console.error('Failed to fetch market data from CoinGecko');
    process.exit(1);
  }
  
  // Read existing state
  let state = await readState();
  
  // Check if we need to reset for a new day
  if (!state || state.date !== currentDate) {
    console.log(`New day detected or no state exists. Initializing state for ${currentDate}...`);
    state = createInitialStateFor24h(currentDate, TIMEZONE, symbols, INITIAL_THRESHOLD);
    await writeState(state);
  } else {
    console.log('Using existing state for today');
  }
  
  // Array to collect all triggers for this run
  const allTriggers = [];
  
  // Check each symbol
  for (const symbol of symbols) {
    console.log(`\nChecking ${symbol}...`);
    
    const coinData = marketData[symbol];
    
    if (!coinData) {
      console.warn(`No market data for ${symbol}, skipping`);
      continue;
    }
    
    console.log(`Current price: $${coinData.price.toFixed(2)}`);
    console.log(`24h change: ${coinData.change24h >= 0 ? '+' : ''}${coinData.change24h.toFixed(2)}%`);
    console.log(`24h high: $${coinData.high24h?.toFixed(2)}, low: $${coinData.low24h?.toFixed(2)}`);
    
    // Get or initialize symbol state
    if (!state.symbols[symbol]) {
      state.symbols[symbol] = { nextThresholdPct: INITIAL_THRESHOLD };
    }
    
    const symbolState = state.symbols[symbol];
    const absPct = Math.abs(coinData.change24h);
    
    console.log(`Absolute change: ${absPct.toFixed(2)}%`);
    console.log(`Next threshold: ${symbolState.nextThresholdPct}%`);
    
    // Check if we've crossed any thresholds
    const symbolTriggers = [];
    while (absPct >= symbolState.nextThresholdPct) {
      console.log(`[ALERT] Threshold ${symbolState.nextThresholdPct}% crossed!`);
      
      symbolTriggers.push({
        symbol: symbol,
        threshold: symbolState.nextThresholdPct,
        pct: coinData.change24h,
        price: coinData.price,
        high24h: coinData.high24h,
        low24h: coinData.low24h,
        name: coinData.name
      });
      
      // Advance to next threshold
      symbolState.nextThresholdPct += THRESHOLD_STEP;
    }
    
    if (symbolTriggers.length > 0) {
      allTriggers.push(...symbolTriggers);
      console.log(`Added ${symbolTriggers.length} trigger(s) for ${symbol}`);
    }
  }
  
  // Send notification if we have triggers
  if (allTriggers.length > 0) {
    console.log(`\n[NOTIFY] Sending notification for ${allTriggers.length} trigger(s)...`);
    const sent = await sendNotification(allTriggers, currentDate);
    if (sent) {
      console.log('[OK] Notification sent successfully');
    } else {
      console.error('[ERROR] Failed to send notification');
    }
  } else {
    console.log('\n[OK] No thresholds crossed, no notification needed');
  }
  
  // Write updated state
  const written = await writeState(state);
  if (written) {
    console.log('[OK] State saved successfully');
  } else {
    console.error('[ERROR] Failed to save state');
  }
  
  console.log('\n=== Crypto Volatility Monitor Completed ===');
}

// Execute main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
