import { getLocalStartOfDayMs, getLocalDateStr } from './time.js';
import { getCurrentPrice, getOpenPriceAtLocalMidnight } from './binance.js';
import { readState, writeState, createInitialState } from './state.js';
import { sendNotification } from './notifier.js';

// Configuration
const TIMEZONE = 'Asia/Shanghai';
const INITIAL_THRESHOLD = 6;
const THRESHOLD_STEP = 2;

/**
 * Main execution function
 */
async function main() {
  console.log('=== Crypto Volatility Monitor Started ===');
  
  // Get symbols from environment or use defaults
  const symbolsStr = process.env.SYMBOLS || 'BTCUSDT,ETHUSDT,BNBUSDT';
  const symbols = symbolsStr.split(',').map(s => s.trim()).filter(s => s);
  
  console.log(`Monitoring symbols: ${symbols.join(', ')}`);
  
  // Get current date and start of day timestamp
  const currentDate = getLocalDateStr(TIMEZONE);
  const startOfDayMs = getLocalStartOfDayMs(TIMEZONE);
  
  console.log(`Current date (${TIMEZONE}): ${currentDate}`);
  console.log(`Start of day timestamp: ${startOfDayMs} (${new Date(startOfDayMs).toISOString()})`);
  
  // Read existing state
  let state = await readState();
  let needsReset = false;
  
  // Check if we need to reset for a new day
  if (!state || state.date !== currentDate) {
    console.log(`New day detected or no state exists. Initializing state for ${currentDate}...`);
    needsReset = true;
    state = createInitialState(currentDate, TIMEZONE, symbols);
    
    // Fetch opening prices for all symbols
    for (const symbol of symbols) {
      const openPrice = await getOpenPriceAtLocalMidnight(symbol, startOfDayMs);
      if (openPrice !== null) {
        state.symbols[symbol].openPrice = openPrice;
        console.log(`${symbol} open price: ${openPrice}`);
      } else {
        console.warn(`Failed to fetch open price for ${symbol}`);
      }
    }
    
    // Write initial state
    await writeState(state);
  } else {
    console.log('Using existing state for today');
  }
  
  // Array to collect all triggers for this run
  const allTriggers = [];
  
  // Check each symbol
  for (const symbol of symbols) {
    console.log(`\nChecking ${symbol}...`);
    
    const symbolState = state.symbols[symbol];
    
    if (!symbolState || symbolState.openPrice === null) {
      console.warn(`No open price for ${symbol}, skipping`);
      continue;
    }
    
    // Get current price
    const currentPrice = await getCurrentPrice(symbol);
    if (currentPrice === null) {
      console.warn(`Failed to fetch current price for ${symbol}, skipping`);
      continue;
    }
    
    console.log(`Current price: ${currentPrice}`);
    
    // Calculate percentage change
    const pct = ((currentPrice - symbolState.openPrice) / symbolState.openPrice) * 100;
    const absPct = Math.abs(pct);
    
    console.log(`Change: ${pct >= 0 ? '+' : ''}${pct.toFixed(2)}% (absolute: ${absPct.toFixed(2)}%)`);
    console.log(`Next threshold: ${symbolState.nextThresholdPct}%`);
    
    // Check if we've crossed any thresholds
    const symbolTriggers = [];
    while (absPct >= symbolState.nextThresholdPct) {
      console.log(`? Threshold ${symbolState.nextThresholdPct}% crossed!`);
      
      symbolTriggers.push({
        symbol: symbol,
        threshold: symbolState.nextThresholdPct,
        pct: pct,
        price: currentPrice,
        openPrice: symbolState.openPrice
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
    console.log(`\n? Sending notification for ${allTriggers.length} trigger(s)...`);
    const sent = await sendNotification(allTriggers, currentDate);
    if (sent) {
      console.log('? Notification sent successfully');
    } else {
      console.error('? Failed to send notification');
    }
  } else {
    console.log('\n? No thresholds crossed, no notification needed');
  }
  
  // Write updated state
  const written = await writeState(state);
  if (written) {
    console.log('? State saved successfully');
  } else {
    console.error('? Failed to save state');
  }
  
  console.log('\n=== Crypto Volatility Monitor Completed ===');
}

// Execute main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

