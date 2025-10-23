import fs from 'fs/promises';
import path from 'path';

const STATE_FILE = '.data/hyperdash.json';

export async function readHyperdashState() {
  try {
    const data = await fs.readFile(STATE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    if (e.code === 'ENOENT') return { addresses: {} };
    console.error('readHyperdashState error:', e.message);
    return { addresses: {} };
  }
}

export async function writeHyperdashState(state) {
  try {
    await fs.mkdir(path.dirname(STATE_FILE), { recursive: true });
    await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('writeHyperdashState error:', e.message);
    return false;
  }
}

export function ensureAddress(state, address) {
  if (!state.addresses[address]) {
    state.addresses[address] = { lastTimestamp: 0, seenIds: [] };
  }
  return state.addresses[address];
}

export function updateAddressProgress(addrState, fills) {
  if (!fills || fills.length === 0) return;
  const latestTs = Math.max(...fills.map(f => f.timestamp));
  addrState.lastTimestamp = Math.max(addrState.lastTimestamp || 0, latestTs);
  const ids = new Set([...(addrState.seenIds || []), ...fills.map(f => f.fillId).filter(Boolean)]);
  // cap to recent 200 ids
  addrState.seenIds = Array.from(ids).slice(-200);
}


