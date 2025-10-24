// Test threshold logic
import { comparePositions } from './src/hyperdash_state.js';

console.log('=== Testing Position Change Threshold Logic ===\n');

// Test case 1: ETH change < 3000 (should NOT trigger)
console.log('Test 1: ETH change from 7000 to 9500 (diff: 2500)');
const oldPos1 = [{
  coin: 'ETH',
  szi: 7000,
  positionValue: 27000000,
  entryPx: 3857,
  unrealizedPnl: 0,
  liquidationPx: 2500,
  leverage: 5,
  leverageType: 'cross'
}];
const newPos1 = [{
  coin: 'ETH',
  szi: 9500,
  positionValue: 36650000,
  entryPx: 3857,
  unrealizedPnl: 0,
  liquidationPx: 2500,
  leverage: 5,
  leverageType: 'cross'
}];
const changes1 = comparePositions(oldPos1, newPos1);
console.log(`  Changed: ${changes1.changed.length > 0 ? 'YES ?' : 'NO ?'}`);
console.log(`  Expected: NO (below 3000 threshold)\n`);

// Test case 2: ETH change > 3000 (should trigger)
console.log('Test 2: ETH change from 7000 to 10500 (diff: 3500)');
const newPos2 = [{
  coin: 'ETH',
  szi: 10500,
  positionValue: 40498500,
  entryPx: 3857,
  unrealizedPnl: 0,
  liquidationPx: 2500,
  leverage: 5,
  leverageType: 'cross'
}];
const changes2 = comparePositions(oldPos1, newPos2);
console.log(`  Changed: ${changes2.changed.length > 0 ? 'YES ?' : 'NO ?'}`);
console.log(`  Expected: YES (above 3000 threshold)\n`);

// Test case 3: BTC change < 100 (should NOT trigger)
console.log('Test 3: BTC change from 50 to 120 (diff: 70)');
const oldPos3 = [{
  coin: 'BTC',
  szi: 50,
  positionValue: 5500000,
  entryPx: 110000,
  unrealizedPnl: 0,
  liquidationPx: 85000,
  leverage: 4,
  leverageType: 'cross'
}];
const newPos3 = [{
  coin: 'BTC',
  szi: 120,
  positionValue: 13200000,
  entryPx: 110000,
  unrealizedPnl: 0,
  liquidationPx: 85000,
  leverage: 4,
  leverageType: 'cross'
}];
const changes3 = comparePositions(oldPos3, newPos3);
console.log(`  Changed: ${changes3.changed.length > 0 ? 'YES ?' : 'NO ?'}`);
console.log(`  Expected: NO (below 100 threshold)\n`);

// Test case 4: BTC change > 100 (should trigger)
console.log('Test 4: BTC change from 50 to 160 (diff: 110)');
const newPos4 = [{
  coin: 'BTC',
  szi: 160,
  positionValue: 17600000,
  entryPx: 110000,
  unrealizedPnl: 0,
  liquidationPx: 85000,
  leverage: 4,
  leverageType: 'cross'
}];
const changes4 = comparePositions(oldPos3, newPos4);
console.log(`  Changed: ${changes4.changed.length > 0 ? 'YES ?' : 'NO ?'}`);
console.log(`  Expected: YES (above 100 threshold)\n`);

// Test case 5: New position (should always trigger)
console.log('Test 5: New position opened (BTC from 0 to 50)');
const oldPos5 = [];
const newPos5 = [{
  coin: 'BTC',
  szi: 50,
  positionValue: 5500000,
  entryPx: 110000,
  unrealizedPnl: 0,
  liquidationPx: 85000,
  leverage: 4,
  leverageType: 'cross'
}];
const changes5 = comparePositions(oldPos5, newPos5);
console.log(`  Added: ${changes5.added.length > 0 ? 'YES ?' : 'NO ?'}`);
console.log(`  Expected: YES (always notify for new positions)\n`);

// Test case 6: Position closed (should always trigger)
console.log('Test 6: Position closed (ETH from 7000 to 0)');
const changes6 = comparePositions(oldPos1, []);
console.log(`  Removed: ${changes6.removed.length > 0 ? 'YES ?' : 'NO ?'}`);
console.log(`  Expected: YES (always notify for closed positions)\n`);

console.log('=== Test Completed ===');

