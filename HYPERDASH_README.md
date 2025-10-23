# Hyperdash �ɽ���������

## ����˵��

���� Hyperliquid ��ָ����ַ���û��ɽ���userFills������ͨ���ʼ�֪ͨ�����ɽ���¼��

### Ĭ�ϼ�����ַ
- `0xc2a30212a8ddac9e123944d6e29faddce994e5f2`
- `0xb317d2bc2d3d2df5fa441b5bae0ab9d8b07283ae`

### ����
- ? �Զ�ȥ�أ�����ʱ�����ɽ� ID��
- ? ״̬�־û���`.data/hyperdash.json`��
- ? �Զ����ԣ�3 �Σ�����ʽ�ӳ٣�
- ? ����ַ������ʼ�֪ͨ
- ? ֧�� Hyperliquid �� Hypereth ���� API

## ����

### ��������

| ������ | ˵�� | Ĭ��ֵ |
|--------|------|--------|
| `HYPERDASH_ADDRESSES` | �����ĵ�ַ�б����ŷָ��� | ����������ַ |
| `HYPERDASH_PROVIDER` | API �ṩ�̣�`hyperliquid` �� `hypereth` | `hyperliquid` |
| `HYPERETH_API_KEY` | Hypereth API ��Կ���� provider=hypereth ʱ��Ҫ�� | - |
| `RESEND_API_KEY` | Resend �ʼ� API ��Կ | **����** |
| `EMAIL_TO` | �����ʼ���ַ | **����** |
| `EMAIL_FROM` | �����ʼ���ַ | **����** |

### API �ṩ�̶Ա�

#### Hyperliquid��Ĭ�ϣ��Ƽ���
- **�˵�**��`https://api.hyperliquid.xyz/info`
- **����**��POST
- **���� API Key**
- **����**������

#### Hypereth
- **�˵�**��`https://api.hypereth.io/v2/hyperliquid/getUserFills`
- **����**��GET
- **��Ҫ API Key**���� headers ������ `X-API-KEY`��
- **����**�������ײ�

## ʹ�÷���

### 1. ���ز���

�����ܷ��ȡ��ʷ�ɽ����ݣ�

```bash
node test-hyperdash.js
```

**Ԥ�������**
```
Address 0xc2a30212a8ddac9e123944d6e29faddce994e5f2 lastTimestamp=0
Fetched 50 fills
New fills: 50
2025-10-23T01:28:55.066Z BTC B px=108150 sz=0.33897
2025-10-23T01:28:55.066Z BTC B px=108150 sz=0.0001
...
```

### 2. �������̲���

���������򣨰����۸��غͳɽ���������

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

�ɽ������Ѽ��ɵ��� workflow��`.github/workflows/volatility-alert.yml`����
- ÿ 5 �����Զ�����
- ��ȡ�³ɽ� �� ȥ�� �� �����ʼ� �� ����״̬
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

�ɽ��ʼ�ʾ����

```
Subject: [Hyperdash Fills] 15 new fills across 2 address(es)

Hyperdash User Fills
============================================================

Address: 0xc2a30212a8ddac9e123944d6e29faddce994e5f2
------------------------------------------------------------
  2025/10/23 09:28:55  BTC       BUY   px=$108150.0000  sz=0.33897
  2025/10/23 09:28:54  BTC       BUY   px=$108150.0000  sz=1.0
  2025/10/23 09:28:53  ETH       SELL  px=$3819.6000   sz=0.5

Address: 0xb317d2bc2d3d2df5fa441b5bae0ab9d8b07283ae
------------------------------------------------------------
  2025/10/23 09:12:39  BTC       BUY   px=$108250.0000  sz=0.15409
  ...

============================================================

Timestamp: 2025/10/23 09:30:00 (Asia/Shanghai)

This is an automated notification for Hyperdash user fills.
```

## ״̬����

### ״̬�ļ�λ��
`.data/hyperdash.json`

### ״̬��ʽ
```json
{
  "addresses": {
    "0xc2a30212a8ddac9e123944d6e29faddce994e5f2": {
      "lastTimestamp": 1729653535066,
      "seenIds": [
        "fill_abc123...",
        "fill_def456..."
      ]
    },
    "0xb317d2bc2d3d2df5fa441b5bae0ab9d8b07283ae": {
      "lastTimestamp": 1729650759997,
      "seenIds": [
        "fill_xyz789..."
      ]
    }
  }
}
```

### ȥ�ػ���
1. **ʱ�������**��ֻ��ȡ `timestamp > lastTimestamp` �ĳɽ�
2. **ID ȥ��**����� `fillId` �Ƿ��� `seenIds` ��
3. **ID ����**��������� 200 �� `fillId`������״̬�ļ�����

### ����״̬

�������»�ȡ������ʷ�ɽ���ɾ��״̬�ļ���
```bash
rm .data/hyperdash.json
```

## �����Ų�

### ���� 1����ȡ��������

**��飺**
```bash
# ���� Hyperliquid API
curl -X POST https://api.hyperliquid.xyz/info \
  -H "Content-Type: application/json" \
  -d '{"type":"userFills","user":"0xc2a30212a8ddac9e123944d6e29faddce994e5f2","n":10}'
```

**����ԭ��**
- ��ַ��ʽ������Ҫ `0x` ǰ׺��
- �õ�ַ�޳ɽ���¼
- API ����

### ���� 2���ظ�֪ͨ

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

**Hyperliquid��**
```javascript
POST https://api.hyperliquid.xyz/info
Content-Type: application/json

{
  "type": "userFills",
  "user": "0xc2a30212a8ddac9e123944d6e29faddce994e5f2",
  "n": 100
}
```

**Hypereth��**
```javascript
GET https://api.hypereth.io/v2/hyperliquid/getUserFills?address=0xc2a30212a8ddac9e123944d6e29faddce994e5f2&limit=100
X-API-KEY: your_key_here
```

### ���ݹ�һ��

��ͬ API ���ص��ֶ�����ͬ��������Զ���һ��Ϊͳһ��ʽ��

```javascript
{
  fillId: string,     // �ɽ� ID
  symbol: string,     // ���׶ԣ��� "BTC"��
  side: string,       // ����"buy" �� "sell"��
  price: number,      // �ɽ��۸�
  size: number,       // �ɽ�����
  quote: number,      // �ɽ����
  fee: number,        // ������
  feeAsset: string,   // �����ѱ���
  isMaker: boolean,   // �Ƿ� maker
  timestamp: number   // ʱ��������룩
}
```

### ���Բ���

- **��ʱʱ��**��30 ��
- **���Դ���**��3 ��
- **�����ӳ�**��2�롢4�롢6�루����ʽ��

### ���ܿ���

- ÿ�������ȡ 100 ���ɽ�
- ������������ַ��ȡ�������������һ��
- ״̬�ļ������������ 200 �� fillId
- �ʼ������е�ַ���³ɽ�����Ϊһ���ʼ�

## ��������

### Q: �ܼ�����������
A: ��ǰ��֧�� Hyperliquid����������������Ҫ�޸� `src/hyperdash.js` �е� API �˵㡣

### Q: �ܼ������н��׶���
A: �ǵģ�API ���ظõ�ַ�����гɽ����Զ��������н��׶ԡ�

### Q: ����ܼ������ٸ���ַ��
A: �����������ƣ������鲻���� 10 �������� API �������ʼ���������

### Q: �ܷ�ֻ�����ض����׶ԣ�
A: ��Ҫ�޸Ĵ�����ˡ��� `src/index.js` �� `monitorHyperdashFills` ��������ӣ�
```javascript
const newOnes = fills.filter(f => 
  (f.timestamp > (aState.lastTimestamp || 0)) && 
  (!aState.seenIds || !aState.seenIds.includes(f.fillId)) &&
  (f.symbol === 'BTC' || f.symbol === 'ETH') // ֻ���� BTC �� ETH
);
```

### Q: �ܷ񰴳ɽ������ˣ�
A: ͬ�ϣ��ڹ�����������ӣ�
```javascript
&& (f.quote >= 1000) // ֻ֪ͨ��� >= 1000 �ĳɽ�
```

## ����ļ�

- `src/hyperdash.js` - API �ͻ���
- `src/hyperdash_state.js` - ״̬����
- `src/notifier.js` - �ʼ�֪ͨ��`sendHyperdashFillsEmail`��
- `src/index.js` - �����̼��ɣ�`monitorHyperdashFills`��
- `test-hyperdash.js` - ���ز��Խű�
- `crypto.plan.md` - ��������ĵ�

## ������־

- **2025-10-23**����ʼ�汾
  - ֧�� Hyperliquid �� Hypereth
  - �Զ�ȥ����״̬�־û�
  - ����ַ������ʼ�֪ͨ
  - ���ɵ��� workflow

