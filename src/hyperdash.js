const HYPERLIQUID_INFO = 'https://api.hyperliquid.xyz/info';
const HYPERETH_FILLS = 'https://api.hypereth.io/v2/hyperliquid/getUserFills';

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

function getProvider() {
  const p = (process.env.HYPERDASH_PROVIDER || 'hyperliquid').toLowerCase();
  return p === 'hypereth' ? 'hypereth' : 'hyperliquid';
}

export async function getUserFills(address, { limit = 100, retries = 3 } = {}) {
  const provider = getProvider();

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (provider === 'hypereth') {
        const url = `${HYPERETH_FILLS}?address=${address}&limit=${limit}`;
        const headers = {};
        const apiKey = process.env.HYPERETH_API_KEY;
        if (apiKey) headers['X-API-KEY'] = apiKey;

        const res = await fetchWithTimeout(url, { headers });
        if (!res.ok) {
          const text = await res.text();
          console.error(`[hypereth] ${address} ${res.status} ${res.statusText} body=${text}`);
          throw new Error(`hypereth ${res.status}`);
        }
        const data = await res.json();
        const fills = Array.isArray(data.fills) ? data.fills : data;
        return normalizeFills(fills);
      } else {
        // hyperliquid info endpoint: POST { type: 'userFills', user: address, n: limit }
        const body = { type: 'userFills', user: address, n: limit };
        const res = await fetchWithTimeout(HYPERLIQUID_INFO, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (!res.ok) {
          const text = await res.text();
          console.error(`[hyperliquid] ${address} ${res.status} ${res.statusText} body=${text}`);
          throw new Error(`hyperliquid ${res.status}`);
        }
        const data = await res.json();
        const fills = Array.isArray(data) ? data : data.fills;
        return normalizeFills(fills);
      }
    } catch (err) {
      if (attempt < retries) {
        const wait = 2000 * attempt;
        console.warn(`getUserFills retry ${attempt}/${retries} in ${wait}ms: ${err.message}`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      console.error(`getUserFills failed for ${address}: ${err.message}`);
      return [];
    }
  }
  return [];
}

function normalizeFills(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((f) => ({
    fillId: f.fillId || f.id || f.hash || `${f.orderId || ''}-${f.timestamp || ''}-${f.tradeId || ''}`,
    symbol: f.coin || f.symbol || f.asset || '',
    side: f.side || (f.isBuy ? 'buy' : (f.isSell ? 'sell' : '')),
    price: Number(f.px || f.price || f.avgPrice || 0),
    size: Number(f.sz || f.quantity || f.qty || 0),
    quote: Number(f.notional || f.quoteQuantity || 0),
    fee: Number(f.fee || 0),
    feeAsset: f.feeAsset || 'USDT',
    isMaker: Boolean(f.isMaker),
    timestamp: Number(f.time || f.timestamp || f.ts || 0)
  })).filter(x => x.timestamp > 0 && x.price > 0 && x.size >= 0);
}


