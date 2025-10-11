# ��Ŀ�ܹ�˵��

���ĵ���ϸ˵���˼��ܻ������ڲ����澯����ļ����ܹ���ʵ��ϸ�ڡ�

## ϵͳ�ܹ�

```
������������������������������������������������������������������������������������������������������������������������������
��                      GitHub Actions                         ��
��  ������������������������������������������������������������������������������������������������������������     ��
��  ��  Cron Trigger (ÿ 5 ����)                          ��     ��
��  �����������������������������������Щ�����������������������������������������������������������������������     ��
��                   ��                                          ��
��  ������������������������������������������������������������������������������������������������������������     ��
��  ��  Node.js Application                               ��     ��
��  ��  ������������������������������������������������������������������������������������������������  ��     ��
��  ��  ��  1. ʱ������ (Luxon)                        ��  ��     ��
��  ��  ��     - ���㱾������ (Asia/Shanghai)          ��  ��     ��
��  ��  ��     - ��ȡ���� 00:00 ʱ���                  ��  ��     ��
��  ��  ������������������������������������������������������������������������������������������������  ��     ��
��  ��  ������������������������������������������������������������������������������������������������  ��     ��
��  ��  ��  2. ״̬����                                ��  ��     ��
��  ��  ��     - ��ȡ .data/state.json                 ��  ��     ��
��  ��  ��     - ���ڼ��������                        ��  ��     ��
��  ��  ������������������������������������������������������������������������������������������������  ��     ��
��  ��  ������������������������������������������������������������������������������������������������  ��     ��
��  ��  ��  3. ���ݻ�ȡ (Binance API)                  ��  ��     ��
��  ��  ��     - ��ȡ���տ��̼� (klines)               ��  ��     ��
��  ��  ��     - ��ȡʵʱ�۸� (ticker/price)           ��  ��     ��
��  ��  ������������������������������������������������������������������������������������������������  ��     ��
��  ��  ������������������������������������������������������������������������������������������������  ��     ��
��  ��  ��  4. �������                                ��  ��     ��
��  ��  ��     - �����ǵ����ٷֱ�                      ��  ��     ��
��  ��  ��     - ����ʽ��ֵ�ж� (6%, 8%, 10%...)      ��  ��     ��
��  ��  ������������������������������������������������������������������������������������������������  ��     ��
��  ��  ������������������������������������������������������������������������������������������������  ��     ��
��  ��  ��  5. �澯֪ͨ (Resend)                       ��  ��     ��
��  ��  ��     - ��װ�ʼ�����                          ��  ��     ��
��  ��  ��     - �����ʼ��澯                          ��  ��     ��
��  ��  ������������������������������������������������������������������������������������������������  ��     ��
��  ��  ������������������������������������������������������������������������������������������������  ��     ��
��  ��  ��  6. ״̬�־û�                              ��  ��     ��
��  ��  ��     - ���� nextThresholdPct                 ��  ��     ��
��  ��  ��     - д�� .data/state.json                 ��  ��     ��
��  ��  ������������������������������������������������������������������������������������������������  ��     ��
��  �����������������������������������Щ�����������������������������������������������������������������������     ��
��                   ��                                          ��
��  ������������������������������������������������������������������������������������������������������������     ��
��  ��  Git Commit & Push                                 ��     ��
��  ��  (״̬�ļ����Ƶ��ֿ�)                              ��     ��
��  ������������������������������������������������������������������������������������������������������������     ��
������������������������������������������������������������������������������������������������������������������������������

  ������������������������������        ������������������������������        ������������������������������
  ��   Binance   ��        ��   Resend    ��        ��   GitHub    ��
  ��   ����API    ��        ��   �ʼ�����   ��        ��   �ֿ�洢   ��
  ������������������������������        ������������������������������        ������������������������������
```

## ģ��˵��

### 1. ʱ�䴦��ģ�� (`src/time.js`)

**ְ��** ����ʱ����ص�ʱ�����

**���Ĺ��ܣ�**
- `getLocalStartOfDayMs(tz)`: ��ȡָ��ʱ������ 00:00 �� Unix ʱ��������룩
- `getLocalDateStr(tz)`: ��ȡָ��ʱ���ĵ�ǰ�����ַ��� (YYYY-MM-DD)
- `getLocalDateTimeStr(tz)`: ��ȡָ��ʱ���ĵ�ǰ����ʱ���ַ���

**������** Luxon (ʱ�������)

**Ϊʲô��Ҫ��**
- GitHub Actions ������ UTC ʱ��
- ������Ҫ���� Asia/Shanghai ʱ������"��������"
- ÿ�� 00:00 (Asia/Shanghai) ��Ҫ����ͳ��

### 2. �Ұ� API �ͻ��� (`src/binance.js`)

**ְ��** ��װ�Ұ����� API ����

**���Ĺ��ܣ�**
- `getCurrentPrice(symbol)`: ��ȡʵʱ�۸�
  - API: `/api/v3/ticker/price?symbol=BTCUSDT`
  - ���أ���ǰ�۸����֣��� null��ʧ�ܣ�
  
- `getOpenPriceAtLocalMidnight(symbol, startMs)`: ��ȡ�������ڿ��̼�
  - API: `/api/v3/klines?symbol=BTCUSDT&interval=1m&startTime=...&limit=1`
  - ���أ����� 00:00 ���һ�� 1m K�ߵĿ��̼�

**�ص㣺**
- ���� API ��Կ�������ӿڣ�
- ���ô�����
- ���� null �����׳��쳣�������ϲ㴦��

### 3. ״̬����ģ�� (`src/state.js`)

**ְ��** ����־û�״̬�Ķ�д

**���Ĺ��ܣ�**
- `readState()`: �� `.data/state.json` ��ȡ״̬
- `writeState(state)`: ��״̬д�� `.data/state.json`
- `createInitialState(date, tz, symbols)`: �����µĳ�ʼ״̬

**״̬�ṹ��**
```json
{
  "date": "2025-10-11",           // ��ǰͳ������
  "tz": "Asia/Shanghai",           // ʱ��
  "symbols": {
    "BTCUSDT": {
      "openPrice": 67890.12,       // ���տ��̼�
      "nextThresholdPct": 8        // ��һ���澯��ֵ
    },
    ...
  }
}
```

**״̬ת���߼���**
- �����ڱ仯ʱ���������� symbol �� `openPrice` �� `nextThresholdPct`
- �����澯�󣬵�����Ӧ symbol �� `nextThresholdPct`
- ״̬�ļ��� GitHub Actions �Զ��ύ�زֿ�

### 4. �ʼ�֪ͨģ�� (`src/notifier.js`)

**ְ��** ͨ�� Resend ���͸澯�ʼ�

**���Ĺ��ܣ�**
- `sendNotification(triggers, date)`: ���͸澯�ʼ�
- `buildSubject(triggers, date)`: �����ʼ�����
- `buildBody(triggers)`: �����ʼ�����

**�ʼ���ʽ��**

����ʾ����
```
[Volatility Alert] Reached 8% intraday (Up) - 2025-10-11
```

����ʾ����
```
Crypto Volatility Alert
==================================================

BTCUSDT hit 6% threshold (now +6.34%, price 68001.23, open 63990.00)
BTCUSDT hit 8% threshold (now +8.12%, price 69123.45, open 63990.00)

---
This is an automated alert from your crypto volatility monitoring service.
```

**������** Resend SDK

### 5. ���������� (`src/index.js`)

**ְ��** Э������ģ�飬ʵ�������ļ������

**ִ�����̣�**

```javascript
1. ��ȡ�������� (SYMBOLS, RESEND_API_KEY, EMAIL_TO, EMAIL_FROM)

2. ���㵱ǰ���ںͿ���ʱ��
   - currentDate = getLocalDateStr('Asia/Shanghai')
   - startOfDayMs = getLocalStartOfDayMs('Asia/Shanghai')

3. ��ȡ״̬�ļ�
   state = await readState()

4. ����Ƿ���Ҫ��������
   if (state.date !== currentDate) {
     // �����µĳ�ʼ״̬
     state = createInitialState(currentDate, TIMEZONE, symbols)
     
     // Ϊÿ�� symbol ��ȡ���̼�
     for (symbol of symbols) {
       openPrice = await getOpenPriceAtLocalMidnight(symbol, startOfDayMs)
       state.symbols[symbol].openPrice = openPrice
     }
   }

5. ����ÿ�� symbol�����۸񲨶�
   for (symbol of symbols) {
     currentPrice = await getCurrentPrice(symbol)
     pct = (currentPrice - openPrice) / openPrice * 100
     absPct = Math.abs(pct)
     
     // ����ʽ��ֵ���
     while (absPct >= state.symbols[symbol].nextThresholdPct) {
       // ��¼����
       triggers.push({
         symbol,
         threshold: state.symbols[symbol].nextThresholdPct,
         pct,
         price: currentPrice,
         openPrice
       })
       
       // �ƽ�����һ����ֵ
       state.symbols[symbol].nextThresholdPct += THRESHOLD_STEP
     }
   }

6. ����д����������ʼ�
   if (triggers.length > 0) {
     await sendNotification(triggers, currentDate)
   }

7. ������º��״̬
   await writeState(state)
```

**���ó�����**
```javascript
const TIMEZONE = 'Asia/Shanghai';   // ʱ��
const INITIAL_THRESHOLD = 6;        // �״θ澯��ֵ (%)
const THRESHOLD_STEP = 2;           // ��ֵ�������� (%)
```

## �ؼ��㷨

### 1. ����ʽ��ֵ�ƽ�

**������** ���۸���ٲ���ʱ��һ�����п��ܿ�Խ�����ֵ

**ʾ����**
- ��ǰ��ֵ��6%
- ��ǰ�ǵ�����+9.5%
- Ԥ����Ϊ��Ӧ�ô��� 6% �� 8% ���θ澯

**ʵ�֣�**
```javascript
const symbolTriggers = [];
while (Math.abs(pct) >= state.symbols[symbol].nextThresholdPct) {
  // ��¼����
  symbolTriggers.push({
    symbol: symbol,
    threshold: state.symbols[symbol].nextThresholdPct,
    pct: pct,
    price: currentPrice,
    openPrice: symbolState.openPrice
  });
  
  // ������ֵ
  state.symbols[symbol].nextThresholdPct += THRESHOLD_STEP;
}
```

**�ŵ㣺**
- ������©�κ���ֵ
- һ���ʼ��������д�������ֵ
- ״̬�ƽ���ԭ�ӵģ�Ҫôȫ���ɹ���Ҫôȫ��ʧ�ܣ�

### 2. ���������߼�

**�ж�������**
```javascript
if (!state || state.date !== currentDate) {
  // ��Ҫ����
}
```

**���ö�����**
1. ������״̬����
2. Ϊÿ�� symbol ��ȡ���տ��̼ۣ�00:00 ��ĵ�һ�� 1m K�ߣ�
3. ���� `nextThresholdPct` Ϊ `INITIAL_THRESHOLD`
4. ������״̬

**Ϊʲô�õ�һ�� K�߶��ǵ�һ�ʽ��ף�**
- K�����ݸ��ȶ��ɿ�
- ��������쳣���׵�Ӱ��
- API ���ü򵥸�Ч

## ������

### �������У����ڣ�

```
1. GitHub Actions ��ʱ����
   ��
2. ��ȡ״̬��date = "2025-10-11"��BTCUSDT.nextThresholdPct = 6
   ��
3. ��ȡʵʱ�۸�BTCUSDT = 68500 (openPrice = 68000)
   ��
4. �����ǵ�����pct = +0.74%
   ��
5. �жϣ�0.74% < 6%��δ����
   ��
6. ����״̬���ޱ仯��
   ��
7. �ύ״̬�ļ����ޱ仯�� git diff Ϊ�գ����ύ��
```

### �����澯

```
1. GitHub Actions ��ʱ����
   ��
2. ��ȡ״̬��date = "2025-10-11"��BTCUSDT.nextThresholdPct = 6
   ��
3. ��ȡʵʱ�۸�BTCUSDT = 72500 (openPrice = 68000)
   ��
4. �����ǵ�����pct = +6.62%
   ��
5. �жϣ�6.62% >= 6%��������
   ��
6. ��¼ trigger: { symbol: "BTCUSDT", threshold: 6, pct: 6.62, ... }
   ��
7. ������ֵ��nextThresholdPct = 8
   ��
8. �����жϣ�6.62% < 8%��ֹͣ
   ��
9. �����ʼ������� BTCUSDT 6% �澯
   ��
10. ����״̬��nextThresholdPct �Ѹ���Ϊ 8
   ��
11. �ύ״̬�ļ����ֿ�
```

### ��������

```
1. GitHub Actions ��ʱ����
   ��
2. ��ȡ״̬��date = "2025-10-10" (������)
   ��
3. ��ǰ���ڣ�currentDate = "2025-10-11" (������)
   ��
4. �жϣ�date !== currentDate����Ҫ����
   ��
5. ������� 00:00 ʱ�����1728583200000
   ��
6. ��ȡ BTCUSDT ���̼ۣ����� klines API
   ��
7. ��ȡ ETHUSDT ���̼ۣ����� klines API
   ��
8. ��ȡ BNBUSDT ���̼ۣ����� klines API
   ��
9. ������״̬��
   {
     date: "2025-10-11",
     symbols: {
       BTCUSDT: { openPrice: 69000, nextThresholdPct: 6 },
       ETHUSDT: { openPrice: 3500, nextThresholdPct: 6 },
       BNBUSDT: { openPrice: 520, nextThresholdPct: 6 }
     }
   }
   ��
10. ���沢�ύ��״̬
```

## ���������

### 1. API ����ʧ��

**���ԣ�** ���� null���ϲ������� symbol

```javascript
const currentPrice = await getCurrentPrice(symbol);
if (currentPrice === null) {
  console.warn(`Failed to fetch current price for ${symbol}, skipping`);
  continue;  // ������ symbol��������������
}
```

**�ô���**
- ����ʧ�ܲ�Ӱ������ symbol
- �´����л�����
- ������Ϊ���� symbol ʧ�ܶ��ж���������

### 2. �ʼ�����ʧ��

**���ԣ�** ��¼���󣬵���Ȼ�ƽ�״̬

```javascript
const sent = await sendNotification(allTriggers, currentDate);
if (!sent) {
  console.error('? Failed to send notification');
  // ��״̬��Ȼ�ᱣ�棬��ֵ�Ѿ��ƽ�
}
```

**Ȩ�⣺**
- ? �����ظ��澯��״̬���ƽ���
- ? ���ܶ�ʧ���ָ澯
- ? ����ͨ���鿴 Actions ��־�ֶ�����

### 3. ״̬�ļ�����ʧ��

**��ȡʧ�ܣ�**
```javascript
let state = await readState();
if (!state) {
  // ��Ϊ�µ�һ�죬������ʼ״̬
}
```

**д��ʧ�ܣ�**
```javascript
const written = await writeState(state);
if (!written) {
  console.error('? Failed to save state');
  // �´����л����¼���
}
```

## ���ܺ�����

### API ����Ƶ��

**ÿ�����У�**
- Binance API��
  - ����ʱ��N �� klines ���ã�N = symbol ������
  - ����ʱ��N �� price ����
  - �ܼƣ��� 6 ��/���У�3 ��Ĭ�� symbol �� 2��

**ÿ�죺**
- ÿ 5 ��������һ�Σ�288 ��/��
- ���з��� 1 �Σ�3 �� klines ����
- �������� 287 �Σ�861 �� price ����
- **�ܼƣ�864 ��/��**

**�Ұ����ƣ�**
- �����ӿڣ�1200 ����/����
- ���ǵ�ʹ�ã�< 1 ����/����
- **��ȫԣ�ȣ�99.9%+**

### GitHub Actions ���

**�����ֿ⣺**
- �������

**˽�вֿ⣺**
- ����˻���2000 ����/��
- ����Ŀÿ�����У�~30 ��
- ÿ�����У�288 �� 30 = 8,640 ��
- ÿ�����ģ�8,640 �� 0.5 ���� = 4,320 ����
- **ע�⣺** ˽�вֿ�ᳬ����Ѷ��

**���飺**
- ʹ�ù����ֿ⣨��ȫ��ѣ�
- �򽵵�����Ƶ�ʣ���ÿ 15 ���ӣ�

### Resend ���

**����ײͣ�**
- 100 ���ʼ�/��

**ÿ���ʼ��ɰ�����**
- ��� symbol �Ķ����ֵ����

**Ԥ����**
- ����ÿ���� 2 �����ָ����� 1 �Σ�2 ��/��
- ÿ�£�~60 ��
- **����Ѷ����**

## ����չ��

### ����±���

**���ƣ�**
- ��Ӳ������
- ���� �� 20 ������������ʱ�� < 1 ���ӣ�

**�ɱ���**
- ÿ�� symbol ���� 1 �� API ����/����
- ����ʱ���� 1 �� klines ����

### �޸ļ��Ƶ��

**��ǰ��** ÿ 5 ����

**��ѡ��**
- ��Ƶ����ÿ 1 ���ӣ�����Ӧ���߳ɱ���
- ��ϡ�裺ÿ 15 ���ӣ��ͳɱ�������Ӧ��

**Ȩ�⣺**
- Ƶ��Խ�ߣ�Խ����©�����ٲ���
- Ƶ��Խ�ͣ�Խʡ Actions ���

### �������֪ͨ����

**����չ�㣺** `src/notifier.js`

**ʾ����**
- Telegram Bot
- Discord Webhook
- ��ҵ΢��
- ����

**ʵ�֣�**
```javascript
export async function sendNotification(triggers, date) {
  await sendEmail(triggers, date);      // ����
  await sendTelegram(triggers, date);   // ����
  await sendDiscord(triggers, date);    // ����
}
```

## ��ȫ��

### ��Կ����

- ? ʹ�� GitHub Secrets �洢������Ϣ
- ? ���ڴ�����Ӳ������Կ
- ? `.env` �ļ��� `.gitignore` ��

### API ��ȫ

- ? ʹ��ֻ���Ĺ��� API��Binance��
- ? Resend API Key ���з���Ȩ��
- ? ���轻�����˺Ż���Ȩ��

### ������˽

- ?? ״̬�ļ��ύ�������ֿ�
  - ���������̼ۡ���ֵ����
  - ��������������Ϣ����Կ
  - ������ȫ˽�ܣ�ʹ��˽�вֿ�

## ����

### ��Ԫ���ԣ�������ӣ�

```javascript
// test/time.test.js
import { getLocalDateStr } from '../src/time.js';
assert(getLocalDateStr('Asia/Shanghai').match(/^\d{4}-\d{2}-\d{2}$/));

// test/binance.test.js
import { getCurrentPrice } from '../src/binance.js';
const price = await getCurrentPrice('BTCUSDT');
assert(price > 0);
```

### ���ɲ���

ʹ�� `test-config.js` ���ж˵��˲��ԣ�
```bash
npm run test-config
```

### �ֶ�����

1. ������ֵ�� 1%
2. �ֶ����� Actions
3. ����ʼ���״̬�ļ�

## ��غ���־

### ��־λ��

- **GitHub Actions ��־��** Actions ��ǩҳ �� ���м�¼ �� check-volatility
- **״̬�����ʷ��** �ֿ� Commits �� ɸѡ "Update volatility state"

### �ؼ���־

```
=== Crypto Volatility Monitor Started ===
Monitoring symbols: BTCUSDT, ETHUSDT, BNBUSDT
Current date (Asia/Shanghai): 2025-10-11
...
Checking BTCUSDT...
Current price: 68500
Change: +0.74% (absolute: 0.74%)
Next threshold: 6%
...
? No thresholds crossed, no notification needed
? State saved successfully
=== Crypto Volatility Monitor Completed ===
```

### �澯ָ��

- ? Actions ���гɹ���
- ? API ���óɹ���
- ? �ʼ����ͳɹ���
- ? ״̬�ļ�����Ƶ��

## �ܽ�

����һ�����������ͳɱ����߿ɿ��ļ��ܻ��Ҳ������ϵͳ��

- ? **�򵥣�** �� JavaScript���޸��ӿ��
- ? **��ѣ�** �����ֿ���ȫ�������
- ? **��ȫ��** ���轻������Կ����ʹ�ù��� API
- ? **�ɿ���** ״̬�־û�������ʽ��ֵ����©
- ? **��׼��** ���ڱ���ʱ�������ڲ�������
- ? **��** ���ڶ��Ʊ��֡���ֵ��֪ͨ��ʽ

�ʺϸ���Ͷ���ߡ����ܻ��Ұ����߿��ٲ���ʹ�á�

