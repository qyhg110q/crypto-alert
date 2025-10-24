import { getLocalDateStr } from './time.js';
import { getMarketData } from './coingecko.js';
import { getClearinghouseState } from './hyperdash.js';
import { readHyperdashState, writeHyperdashState, ensureAddress, comparePositions, updateAddressPositions, updateLastNotifiedPositions } from './hyperdash_state.js';
import { readState, writeState, createInitialStateFor24h } from './state.js';
import { sendNotification, sendPositionChangeEmail } from './notifier.js';

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
  
  // Run Hyperdash position monitor
  await monitorHyperdashPositions();

  console.log('\n=== Crypto Volatility Monitor Completed ===');
}

// Execute main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

// Hyperdash position monitor (invoked within the same run)
async function monitorHyperdashPositions() {
  const addrsEnv = process.env.HYPERDASH_ADDRESSES || '0xc2a30212a8ddac9e123944d6e29faddce994e5f2,0xb317d2bc2d3d2df5fa441b5bae0ab9d8b07283ae';
  const addresses = addrsEnv.split(',').map(s => s.trim()).filter(Boolean);
  if (addresses.length === 0) return;

  console.log('\n=== Hyperdash Position Monitor ===');
  const state = await readHyperdashState();

  for (const addr of addresses) {
    const aState = ensureAddress(state, addr);
    console.log(`Checking positions for ${addr}`);
    
    // Fetch current positions
    const currentPositions = await getClearinghouseState(addr);
    if (!currentPositions) {
      console.error(`Failed to fetch positions for ${addr}`);
      continue;
    }
    
    // Always update current positions (for tracking)
    updateAddressPositions(aState, currentPositions);
    
    // Use lastNotifiedPositions as baseline for comparison (not current positions)
    const baselinePositions = Object.keys(aState.lastNotifiedPositions || {}).map(coin => ({
      coin,
      ...aState.lastNotifiedPositions[coin]
    }));
    
    // Compare current positions with LAST NOTIFIED baseline
    const changes = comparePositions(baselinePositions, currentPositions);
    const totalChanges = changes.added.length + changes.removed.length + changes.changed.length;
    
    if (totalChanges > 0) {
      console.log(`Detected changes for ${addr}: ${changes.added.length} new, ${changes.removed.length} closed, ${changes.changed.length} changed`);
      
      // Send notification
      const sent = await sendPositionChangeEmail(addr, changes);
      if (sent) {
        // Update lastNotifiedPositions baseline for NEXT comparison
        updateLastNotifiedPositions(aState, currentPositions);
        console.log(`Updated notification baseline for ${addr}`);
      }
    } else {
      console.log(`No position changes for ${addr}`);
      // First run: initialize baseline with current positions (no notification)
      if (Object.keys(aState.lastNotifiedPositions || {}).length === 0 && currentPositions.length > 0) {
        updateLastNotifiedPositions(aState, currentPositions);
        console.log(`Initialized notification baseline for ${addr} (first run, no notification)`);
      }
    }
  }

  // Save state
  await writeHyperdashState(state);
}
