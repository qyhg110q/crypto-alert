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
    state.addresses[address] = { positions: {} };
  }
  return state.addresses[address];
}

/**
 * Compare current positions with previous snapshot
 * Returns: { added: [], removed: [], changed: [] }
 */
export function comparePositions(oldPositions, newPositions) {
  const result = { added: [], removed: [], changed: [] };
  
  const oldMap = new Map();
  const newMap = new Map();
  
  (oldPositions || []).forEach(p => oldMap.set(p.coin, p));
  (newPositions || []).forEach(p => newMap.set(p.coin, p));
  
  // Check for added coins
  for (const [coin, newPos] of newMap) {
    if (!oldMap.has(coin)) {
      result.added.push(newPos);
    }
  }
  
  // Check for removed coins
  for (const [coin, oldPos] of oldMap) {
    if (!newMap.has(coin)) {
      result.removed.push(oldPos);
    }
  }
  
  // Check for changed positions
  for (const [coin, newPos] of newMap) {
    const oldPos = oldMap.get(coin);
    if (oldPos && hasPositionChanged(oldPos, newPos)) {
      result.changed.push({ old: oldPos, new: newPos });
    }
  }
  
  return result;
}

/**
 * Check if position has significant changes
 */
function hasPositionChanged(oldPos, newPos) {
  // Check if szi changed (even small changes matter for position tracking)
  if (Math.abs(oldPos.szi - newPos.szi) > 0.0001) return true;
  
  // Check if positionValue changed significantly (>$1 or >0.01%)
  const valueDiff = Math.abs(oldPos.positionValue - newPos.positionValue);
  const valuePctChange = valueDiff / Math.abs(oldPos.positionValue);
  if (valueDiff > 1 && valuePctChange > 0.0001) return true;
  
  // Check if entryPx changed significantly (>0.01%)
  if (Math.abs((oldPos.entryPx - newPos.entryPx) / oldPos.entryPx) > 0.0001) return true;
  
  return false;
}

/**
 * Update address state with new positions
 */
export function updateAddressPositions(addrState, positions) {
  addrState.positions = {};
  positions.forEach(p => {
    addrState.positions[p.coin] = {
      szi: p.szi,
      positionValue: p.positionValue,
      entryPx: p.entryPx,
      unrealizedPnl: p.unrealizedPnl,
      liquidationPx: p.liquidationPx,
      leverage: p.leverage,
      leverageType: p.leverageType
    };
  });
}


