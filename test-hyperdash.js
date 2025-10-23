import { getClearinghouseState } from './src/hyperdash.js';

const addresses = [
  '0xc2a30212a8ddac9e123944d6e29faddce994e5f2',
  '0xb317d2bc2d3d2df5fa441b5bae0ab9d8b07283ae',
  '0x4e8d91cB10b32CA351Ac8f1962F33514a96797F4'
];

console.log('=== Testing Hyperdash Position Fetching ===\n');

for (const addr of addresses) {
  console.log(`\nAddress: ${addr}`);
  console.log('-'.repeat(60));
  
  const positions = await getClearinghouseState(addr);
  
  if (!positions || positions.length === 0) {
    console.log('  No open positions');
    continue;
  }
  
  console.log(`  Found ${positions.length} position(s):\n`);
  
  for (const p of positions) {
    const dir = p.szi > 0 ? 'LONG' : 'SHORT';
    console.log(`  ${p.coin}:`);
    console.log(`    Direction: ${dir}`);
    console.log(`    Size: ${Math.abs(p.szi).toFixed(4)} contracts`);
    console.log(`    Position Value: $${Math.abs(p.positionValue).toFixed(2)}`);
    console.log(`    Entry Price: $${p.entryPx.toFixed(4)}`);
    console.log(`    Unrealized PnL: $${p.unrealizedPnl.toFixed(2)}`);
    if (p.liquidationPx) {
      console.log(`    Liquidation Price: $${p.liquidationPx.toFixed(4)}`);
    }
    console.log(`    Leverage: ${p.leverage.toFixed(1)}x (${p.leverageType})`);
    console.log('');
  }
}

console.log('\n=== Test Completed ===');
