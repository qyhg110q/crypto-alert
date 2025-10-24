# Hyperdash ��λ��ع���

## ����˵��

���� Hyperliquid ��ָ����ַ�Ĳ�λ�仯��clearinghouseState������ͨ���ʼ�֪ͨ��
- **�¿���λ**����⵽�µĳֲ� coin
- **ƽ��**����⵽ coin �ֲ���ʧ
- **��λ�仯**����⵽ szi����Լ�������� positionValue��ͷ�����壩�仯

### Ĭ�ϼ�����ַ
- `0xc2a30212a8ddac9e123944d6e29faddce994e5f2`
- `0xb317d2bc2d3d2df5fa441b5bae0ab9d8b07283ae`

### �������
- **coin**���ʲ�/���׶�
- **szi**����Լ����������=��֣�����=�ղ֣�
- **positionValue**��ͷ�������ֵ
- **entryPx**���볡����
- **unrealizedPnl**��δʵ��ӯ��
- **liquidationPx**��Ԥ��ǿƽ��
- **leverage**����ǰ�ܸ˱���
- **leverageType**���ܸ����ͣ�cross ȫ�� / isolated ��֣�

### ����
- ? �Զ�����¿���λ
- ? �Զ����ƽ��
- ? �Զ�����λ�仯���Ӳ�/����/���֣�
- ? ״̬�־û���`.data/hyperdash.json`��
- ? �Զ����ԣ�3 �Σ�����ʽ�ӳ٣�
- ? ����ַ����֪ͨ

## ����

### ��������

| ������ | ˵�� | Ĭ��ֵ |
|--------|------|--------|
| `HYPERDASH_ADDRESSES` | �����ĵ�ַ�б����ŷָ��� | ����������ַ |
| `RESEND_API_KEY` | Resend �ʼ� API ��Կ | **����** |
| `EMAIL_TO` | �����ʼ���ַ | **����** |
| `EMAIL_FROM` | �����ʼ���ַ | **����** |

### API ˵��

ʹ�� Hyperliquid �ٷ� API��
- **�˵�**��`https://api.hyperliquid.xyz/info`
- **����**��POST
- **������**��`{ "type": "clearinghouseState", "user": "0x��ַ" }`
- **���� API Key**
- **����**������

## ʹ�÷���

### 1. ���ز���

�����ܷ��ȡ��λ���ݣ�

```bash
node test-hyperdash.js
```

**Ԥ��������гֲ�ʱ����**
```
Address: 0xc2a30212a8ddac9e123944d6e29faddce994e5f2
------------------------------------------------------------
  Found 2 position(s):

  BTC:
    Direction: LONG
    Size: 0.5000 contracts
    Position Value: $54100.00
    Entry Price: $108200.0000
    Unrealized PnL: $150.00
    Liquidation Price: $102000.0000
    Leverage: 2.0x (cross)

  ETH:
    Direction: SHORT
    Size: 5.0000 contracts
    Position Value: $19100.00
    Entry Price: $3820.0000
    Unrealized PnL: -$50.00
    Leverage: 3.0x (isolated)
```

**Ԥ��������޳ֲ�ʱ����**
```
Address: 0xc2a30212a8ddac9e123944d6e29faddce994e5f2
------------------------------------------------------------
  No open positions
```

### 2. �������̲���

���������򣨰����۸��غͲ�λ��أ���

```bash
# Windows PowerShell
$env:RESEND_API_KEY="re_your_key"
$env:EMAIL_TO="your@email.com"
$env:EMAIL_FROM="noreply@yourdomain.com"
npm start

# Linux/Mac
RESEND_API_KEY=re_your_key \
EMAIL_TO=your@email.com \
EMAIL_FROM=noreply@yourdomain.com \
npm start
```

### 3. GitHub Actions �Զ�����

��λ����Ѽ��ɵ��� workflow��`.github/workflows/volatility-alert.yml`����
- ÿ 5 �����Զ�����
- ��ȡ��λ �� �ȶԱ仯 �� �����ʼ� �� ����״̬
- ״̬�ļ��Զ��ύ�زֿ�

### 4. �Զ��������ַ

**���� 1�������������Ƽ���**

```bash
# Windows PowerShell
$env:HYPERDASH_ADDRESSES="0x��ַ1,0x��ַ2,0x��ַ3"
npm start

# GitHub Actions Secrets
HYPERDASH_ADDRESSES=0x��ַ1,0x��ַ2,0x��ַ3
```

**���� 2���޸Ĵ���**

�༭ `src/index.js`���޸�Ĭ��ֵ��
```javascript
const addrsEnv = process.env.HYPERDASH_ADDRESSES || '��ĵ�ַ1,��ĵ�ַ2';
```

## �ʼ���ʽ

### �¿���λ
```
Subject: [Hyperdash Position] 2 opened - 0xc2a3...e5f2

NEW POSITIONS OPENED:
------------------------------------------------------------
  BTC
    Size: LONG 0.5000 contracts
    Position Value: $54100.00
    Entry Price: $108200.0000
    Unrealized PnL: $0.00
    Liquidation Price: $102000.0000
    Leverage: 2.0x (cross)

  ETH
    Size: SHORT 5.0000 contracts
    Position Value: $19100.00
    Entry Price: $3820.0000
    Unrealized PnL: $0.00
    Leverage: 3.0x (isolated)
```

### ƽ��
```
Subject: [Hyperdash Position] 1 closed - 0xc2a3...e5f2

POSITIONS CLOSED:
------------------------------------------------------------
  BTC
    Closed Size: LONG 0.5000 contracts
    Last Value: $54250.00
    Entry Price: $108200.0000
    Final PnL: $150.00
```

### ��λ�仯
```
Subject: [Hyperdash Position] 1 changed - 0xc2a3...e5f2

POSITIONS CHANGED:
------------------------------------------------------------
  BTC
    Size: LONG 0.5000 -> LONG 1.0000 (+0.5000)
    Value: $54100.00 -> $108200.00 (+$54100.00)
    Entry Px: $108200.0000 -> $108200.0000
    Current PnL: $300.00
    Liquidation Px: $102000.0000
    Leverage: 2.0x (cross)
```

## ״̬����

### ״̬�ļ�λ��
`.data/hyperdash.json`

### ״̬��ʽ
```json
{
  "addresses": {
    "0xc2a30212a8ddac9e123944d6e29faddce994e5f2": {
      "positions": {
        "BTC": { "szi": 180.3, "positionValue": 20057568.90, ... },
        "ETH": { "szi": 33270.78, "positionValue": 131712368.22, ... }
      },
      "lastNotifiedPositions": {
        "BTC": { "szi": 100.0, "positionValue": 11000000.00, ... },
        "ETH": { "szi": 30000.0, "positionValue": 115000000.00, ... }
      }
    }
  }
}
```

**˵��**��
- `positions`����ǰʵ�ʲ�λ��ÿ�����и��£�
- `lastNotifiedPositions`����һ��֪ͨʱ�Ĳ�λ����֪ͨ����£���Ϊ�´αȶԻ�׼��

### �仯������

**��Ҫ**��ϵͳ��**��һ��֪ͨʱ�Ĳ�λ**��Ϊ��׼���бȶԣ�������ÿ�����еĲ�λ��

1. **�¿���**����ǰ��λ�г����µ� coin
   - **����������**���κ��¿��ֶ���֪ͨ
   - ʾ����BTC �� 0 �� 10 ��Լ �� ? ֪ͨ����׼��Ϊ 10
   
2. **ƽ��**���ϴ�֪ͨ��׼�е� coin ��ʧ
   - **����������**���κ�ƽ�ֶ���֪ͨ
   - ʾ����BTC �ӻ�׼ 300 �� 0 ��Լ �� ? ֪ͨ
   
3. **��λ�仯**���Ӳ�/���֣���
   - **ETH ��ֵ��3000 ����Լ**
   - **BTC ��ֵ��100 ����Լ**
   - **�������֣�1% ��λ�仯**
   - ����Լ������szi����**�ϴ�֪ͨ��׼**�ȶԣ����ܱҼ۲���Ӱ��
   
   **ʾ�� 1��BTC �𲽼Ӳ�**
   - �״ν��֣�0 �� 10 ��Լ �� ? ֪ͨ��**��׼ = 10**
   - �Ӳ֣�10 �� 50 �� 90�����׼ 10 �ȣ��仯 80 < 100���� ? ��֪ͨ����׼��Ϊ 10
   - �����Ӳ֣�90 �� 130�����׼ 10 �ȣ��仯 120 > 100���� ? ֪ͨ��**��׼ = 130**
   - С��������130 �� 150�����׼ 130 �ȣ��仯 20 < 100���� ? ��֪ͨ
   - �����Ӳ֣�150 �� 250�����׼ 130 �ȣ��仯 120 > 100���� ? ֪ͨ��**��׼ = 250**
   
   **ʾ�� 2��ETH ˫�򴥷�**
   - ��ʼ��׼��300 ETH ��Լ
   - �Ӳ֣�300 �� 3500���仯 3200 > 3000���� ? ֪ͨ��**��׼ = 3500**
   - �´δ���������
     - �Ӳֵ� > 6500��+3000���� ֪ͨ
     - ���ֵ� < 500��-3000���� ֪ͨ

### ����״̬

�������³�ʼ����ɾ��״̬�ļ���
```bash
rm .data/hyperdash.json
```

�´�����ʱ���¼��ǰ���в�λ��Ϊ��ʼ״̬�����ᷢ��֪ͨ��

## �����Ų�

### ���� 1����ȡ��������

**��飺**
```bash
# ���� Hyperliquid API
curl -X POST https://api.hyperliquid.xyz/info \
  -H "Content-Type: application/json" \
  -d '{"type":"clearinghouseState","user":"0xc2a30212a8ddac9e123944d6e29faddce994e5f2"}'
```

**����ԭ��**
- ��ַ��ʽ������Ҫ `0x` ǰ׺��
- �õ�ַ�޳ֲ֣����������
- API ������������

### ���� 2���󱨲�λ�仯

**��飺**
- `.data/hyperdash.json` �Ƿ���ȷ����
- GitHub Actions �Ƿ����ύ��ͻ

**�����**
```bash
# �鿴״̬�ļ�
cat .data/hyperdash.json

# �ֶ�����һ�θ���
node test-hyperdash.js
```

### ���� 3���ʼ�δ�յ�

**��飺**
1. `RESEND_API_KEY` �Ƿ���ȷ
2. `EMAIL_FROM` �����Ƿ��� Resend ����֤
3. �����ʼ��ļ���
4. GitHub Actions ��־���Ƿ��д���

### �鿴��־

**GitHub Actions��**
1. ���ʲֿ� �� Actions
2. �������� workflow run
3. չ�� "Run volatility alert"
4. ���� "Hyperdash" �鿴�����־

**���أ�**
```bash
node test-hyperdash.js 2>&1 | tee hyperdash.log
```

## ����ϸ��

### API ����ʾ��

```javascript
POST https://api.hyperliquid.xyz/info
Content-Type: application/json

{
  "type": "clearinghouseState",
  "user": "0xc2a30212a8ddac9e123944d6e29faddce994e5f2"
}
```

### API ��Ӧ�ṹ

```javascript
{
  "assetPositions": [
    {
      "position": {
        "coin": "BTC",
        "szi": "0.5",
        "positionValue": "54100.00",
        "entryPx": "108200.0000",
        "unrealizedPnl": "150.00",
        "liquidationPx": "102000.0000",
        "leverage": {
          "value": "2.0",
          "type": "cross"
        }
      },
      "type": "oneWay"
    }
  ],
  "marginSummary": { ... },
  ...
}
```

### ���ݹ�һ��

������Զ���һ��Ϊͳһ��ʽ��

```javascript
{
  coin: string,           // �ʲ�����
  szi: number,            // ��Լ��������=�࣬��=�գ�
  positionValue: number,  // ͷ�������ֵ
  entryPx: number,        // �볡����
  unrealizedPnl: number,  // δʵ��ӯ��
  liquidationPx: number|null, // ǿƽ�ۣ�����Ϊ null��
  leverage: number,       // �ܸ˱���
  leverageType: string    // 'cross' �� 'isolated'
}
```

### ���Բ���

- **��ʱʱ��**��30 ��
- **���Դ���**��3 ��
- **�����ӳ�**��2�롢4�롢6�루����ʽ��

### ���ܿ���

- ÿ����ȡ������λ����
- ������������ַ��ȡ�������������һ��
- ״̬�ļ����洢���� coin ����������
- �ʼ���ÿ����ַ�ı仯���������ʼ�

## ��������

### Q: �ܼ������� DEX ��
A: ��ǰ��֧�� Hyperliquid���������� DEX����Ҫ�޸� `src/hyperdash.js` �е� API �˵㡣

### Q: Ϊʲô�״����в�֪ͨ��
A: �״����л��¼��ǰ��λ��Ϊ��׼״̬���ӵڶ������п�ʼ�ż��仯��

### Q: ����ܼ������ٸ���ַ��
A: �����������ƣ������鲻���� 10 �������� API ��������

### Q: ��ε����仯֪ͨ��ֵ��
A: ���������ù��ˣ�����Լ�����жϣ���
- **�¿���/ƽ��**�����������ƣ�����֪ͨ
- **��λ�仯**��
  - ETH������ **3000 ����Լ**
  - BTC������ **100 ����Լ**
  - �������֣����� **1% ��λ**
- ���� `src/hyperdash_state.js` ���޸� `THRESHOLDS` ����

### Q: �ܷ�ֻ�����ض����֣�
A: ��Ҫ�޸Ĵ��롣�� `src/index.js` �� `monitorHyperdashPositions` ��������ӣ�
```javascript
const currentPositions = await getClearinghouseState(addr);
const filteredPositions = currentPositions.filter(p => 
  p.coin === 'BTC' || p.coin === 'ETH' // ֻ���� BTC �� ETH
);
```

### Q: �ܷ�ӯ����ֵ������
A: ��Ҫ�޸Ĵ��롣�� `src/hyperdash_state.js` �� `comparePositions` ���������ӯ����ֵ��顣

### Q: Ϊʲô��ʱ�� liquidationPx �� null��
A: ȫ��ģʽ��cross����͸ܸ�ʱ��ǿƽ�ۿ��ܷǳ�Զ���޷����㣬API ���� null��

## ����ļ�

- `src/hyperdash.js` - API �ͻ��ˣ�getClearinghouseState��
- `src/hyperdash_state.js` - ״̬����comparePositions, updateAddressPositions��
- `src/notifier.js` - �ʼ�֪ͨ��sendPositionChangeEmail��
- `src/index.js` - �����̼��ɣ�monitorHyperdashPositions��
- `test-hyperdash.js` - ���ز��Խű�
- `crypto.plan.md` - ��������ĵ�

## ������־

- **2025-10-23**��V2.0 ��λ��ذ汾
  - **�ش���**���ӳɽ�������Ϊ��λ���
  - ��� clearinghouseState API
  - ����¿��֡�ƽ�֡���λ�仯
  - ��ʾ������λ��Ϣ��szi, positionValue, entryPx, PnL, ǿƽ��, �ܸˣ�
  - �Ż��仯����㷨
