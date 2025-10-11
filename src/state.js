import fs from 'fs/promises';
import path from 'path';

const STATE_FILE = '.data/state.json';

/**
 * Read the state from disk
 * @returns {Promise<object|null>} State object or null if doesn't exist
 */
export async function readState() {
  try {
    const data = await fs.readFile(STATE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    console.error('Error reading state file:', error.message);
    return null;
  }
}

/**
 * Write the state to disk
 * @param {object} state - State object to write
 * @returns {Promise<boolean>} Success status
 */
export async function writeState(state) {
  try {
    // Ensure directory exists
    const dir = path.dirname(STATE_FILE);
    await fs.mkdir(dir, { recursive: true });
    
    // Write with pretty formatting
    await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing state file:', error.message);
    return false;
  }
}

/**
 * Create an initial state for a new day
 * @param {string} date - Date string (YYYY-MM-DD)
 * @param {string} tz - Timezone
 * @param {string[]} symbols - Array of symbol names
 * @returns {object} Initial state object
 */
export function createInitialState(date, tz, symbols) {
  const state = {
    date,
    tz,
    symbols: {}
  };
  
  for (const symbol of symbols) {
    state.symbols[symbol] = {
      openPrice: null,
      nextThresholdPct: 6
    };
  }
  
  return state;
}

