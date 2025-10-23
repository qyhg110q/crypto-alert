const HYPERLIQUID_INFO = 'https://api.hyperliquid.xyz/info';
const REQUEST_TIMEOUT = 30000;

async function fetchWithTimeout(url, options = {}, timeout = REQUEST_TIMEOUT) {
  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(to);
    return res;
  } catch (e) {
    clearTimeout(to);
    throw e;
  }
}

/**
 * Get clearinghouse state (positions) for a user
 * @param {string} address - User address
 * @param {number} retries - Retry attempts
 * @returns {Promise<Array>} Array of normalized positions
 */
export async function getClearinghouseState(address, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const body = { type: 'clearinghouseState', user: address };
      const res = await fetchWithTimeout(HYPERLIQUID_INFO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) {
        const text = await res.text();
        console.error(`[clearinghouseState] ${address} ${res.status} ${res.statusText} body=${text}`);
        throw new Error(`clearinghouseState ${res.status}`);
      }
      
      const data = await res.json();
      if (!data || !data.assetPositions) {
        console.error(`[clearinghouseState] Invalid response for ${address}:`, data);
        return [];
      }
      
      return normalizePositions(data.assetPositions);
      
    } catch (err) {
      if (attempt < retries) {
        const wait = 2000 * attempt;
        console.warn(`getClearinghouseState retry ${attempt}/${retries} in ${wait}ms: ${err.message}`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      console.error(`getClearinghouseState failed for ${address}: ${err.message}`);
      return [];
    }
  }
  return [];
}

/**
 * Normalize position data from clearinghouseState
 * @param {Array} assetPositions - Raw asset positions from API
 * @returns {Array} Normalized positions
 */
function normalizePositions(assetPositions) {
  if (!Array.isArray(assetPositions)) return [];
  
  return assetPositions.map(ap => {
    const pos = ap.position;
    if (!pos) return null;
    
    const coin = pos.coin || '';
    const szi = Number(pos.szi || 0);
    const positionValue = Number(pos.positionValue || 0);
    const entryPx = Number(pos.entryPx || 0);
    const unrealizedPnl = Number(pos.unrealizedPnl || 0);
    const liquidationPx = pos.liquidationPx ? Number(pos.liquidationPx) : null;
    
    // leverage info
    const leverage = pos.leverage || {};
    const leverageValue = Number(leverage.value || 0);
    const leverageType = leverage.type || 'cross'; // cross or isolated
    
    return {
      coin,
      szi,
      positionValue,
      entryPx,
      unrealizedPnl,
      liquidationPx,
      leverage: leverageValue,
      leverageType
    };
  }).filter(p => p && p.coin && p.szi !== 0); // Filter out null and zero positions
}


