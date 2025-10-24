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
    state.addresses[address] = { 
      positions: {},           // Current positions (updated every run)
      lastNotifiedPositions: {} // Positions at last notification (baseline for comparison)
    };
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
 * Thresholds based on contract size (szi) change:
 * - ETH: 3000 contracts
 * - BTC: 100 contracts
 * - Other coins: 1% of absolute position size
 */
function hasPositionChanged(oldPos, newPos) {
  // Define thresholds per coin
  const THRESHOLDS = {
    'ETH': 3000,
    'BTC': 100,
  };
  
  // Get threshold for this coin, or use 1% of position as default
  const threshold = THRESHOLDS[newPos.coin] || Math.abs(oldPos.szi) * 0.01;
  
  // Check if szi changed significantly
  const sziDiff = Math.abs(newPos.szi - oldPos.szi);
  if (sziDiff > threshold) return true;
  
  return false;
}

/**
 * Update address state with new positions (called every run)
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

/**
 * Update lastNotifiedPositions baseline (only called after successful notification)
 * This sets the baseline for the NEXT notification
 */
export function updateLastNotifiedPositions(addrState, positions) {
  addrState.lastNotifiedPositions = {};
  positions.forEach(p => {
    addrState.lastNotifiedPositions[p.coin] = {
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


