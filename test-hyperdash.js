import { getUserFills } from './src/hyperdash.js';
import { readHyperdashState, ensureAddress, updateAddressProgress, writeHyperdashState } from './src/hyperdash_state.js';

async function main() {
  const addrsEnv = process.env.HYPERDASH_ADDRESSES || '0xc2a30212a8ddac9e123944d6e29faddce994e5f2,0xb317d2bc2d3d2df5fa441b5bae0ab9d8b07283ae';
  const addresses = addrsEnv.split(',').map(s => s.trim()).filter(Boolean);
  const state = await readHyperdashState();

  for (const addr of addresses) {
    const a = ensureAddress(state, addr);
    console.log(`Address ${addr} lastTimestamp=${a.lastTimestamp}`);
    const fills = await getUserFills(addr, { limit: 50 });
    console.log(`Fetched ${fills.length} fills`);
    const newOnes = fills.filter(f => (f.timestamp > (a.lastTimestamp || 0)) && (!a.seenIds || !a.seenIds.includes(f.fillId)));
    console.log(`New fills: ${newOnes.length}`);
    for (const f of newOnes) {
      console.log(`${new Date(f.timestamp).toISOString()} ${f.symbol} ${f.side} px=${f.price} sz=${f.size}`);
    }
    updateAddressProgress(a, newOnes);
  }

  await writeHyperdashState(state);
}

main().catch(e => { console.error(e); process.exit(1); });


