# API Ǩ��˵������ Binance �� CoinGecko

## ? ΪʲôҪǨ�ƣ�

�ڲ��Թ����з��֣�**Binance API �� GitHub Actions �����о���ʧ��**����Ҫԭ��
- GitHub Actions �������� IP ���ܱ� Binance ����
- �����ӳٵ���Ƶ����ʱ
- ���Ӳ��ȶ�

�������ԣ�**CoinGecko API �� GitHub Actions �б����ȶ�**����˽�����Ǩ�ơ�

## ? ��Ҫ���

### 1. API �ṩ��
- **֮ǰ**��Binance Public API
- **����**��CoinGecko API

### 2. ���ģʽ
- **֮ǰ**�����������ǵ���������� Asia/Shanghai 00:00 �Ŀ��̼ۣ�
- **����**��24 Сʱ�����ǵ���

### 3. ����Դ
**֮ǰ��Binance����**
```
ʵʱ�۸�: /api/v3/ticker/price?symbol=BTCUSDT
���̼�: /api/v3/klines?symbol=BTCUSDT&interval=1m&startTime=...
```

**���ڣ�CoinGecko����**
```
�г�����: /api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin&price_change_percentage=24h
```

### 4. ���׶�ӳ��
```javascript
BTCUSDT �� bitcoin (CoinGecko ID)
ETHUSDT �� ethereum (CoinGecko ID)
BNBUSDT �� binancecoin (CoinGecko ID)
```

## ? ��������

### 24 Сʱ�۸�Χ
�ʼ�֪ͨ�����ڰ�����
- ��ǰ�۸�
- 24 Сʱ�ǵ���
- 24 Сʱ��߼�
- 24 Сʱ��ͼ�

### ���õĴ�����
- 3 ���Զ�����
- ����ʽ�ӳ٣�2�롢4�롢6�룩
- 30 �볬ʱ

## ? ������

### �����ļ�
- `src/coingecko.js` - CoinGecko API �ͻ���
- `test-coingecko.js` - CoinGecko API ���Խű�

### �޸��ļ�
- `src/index.js` - ���߼����� CoinGecko
- `src/state.js` - ��� 24h ģʽ֧��
- `src/notifier.js` - �ʼ���ʽ����
- `src/test-email.js` - �����ʼ����� CoinGecko

### �����ļ�����ѡɾ����
- `src/binance.js` - ������Ϊ�ο�������ɾ��
- `test-price.js` - Binance ���Խű�������ɾ��

## ? ���ñ��

**������ģ�** �����������ֲ��䣺
```
RESEND_API_KEY=your_key
EMAIL_TO=your@email.com
EMAIL_FROM=noreply@yourdomain.com
SYMBOLS=BTCUSDT,ETHUSDT,BNBUSDT  # ��ѡ��Ĭ��������
```

## ? ״̬�ļ����

**�ɸ�ʽ��Binance����**
```json
{
  "date": "2025-10-11",
  "tz": "Asia/Shanghai",
  "symbols": {
    "BTCUSDT": {
      "openPrice": 67890.12,
      "nextThresholdPct": 6
    }
  }
}
```

**�¸�ʽ��CoinGecko����**
```json
{
  "date": "2025-10-11",
  "tz": "Asia/Shanghai",
  "mode": "24h",
  "symbols": {
    "BTCUSDT": {
      "nextThresholdPct": 6
    }
  }
}
```

> ע�⣺������Ҫ�洢 `openPrice`����Ϊʹ�� CoinGecko �� 24 Сʱ�仯�ٷֱ�

## ? ���Բ���

### 1. ���ز��� CoinGecko API
```bash
node test-coingecko.js
```

Ӧ�ÿ������������
```
============================================================
CoinGecko API Test
============================================================
...
BITCOIN (BTC)
  Current Price: $112,002.00
  24h Change: -4.68%
============================================================
TEST PASSED!
============================================================
```

### 2. �����ʼ�����
�� GitHub Actions ���ֶ����� **Test Email** workflow���򱾵����У�
```bash
npm run test-email
```

### 3. �����������
```bash
npm start
```

## ? �ʼ���ʽ�仯

**ʾ���ʼ����¸�ʽ����**
```
Crypto Volatility Alert
============================================================

BTCUSDT hit 6% threshold (24h change: -6.32%, current price: $111,976.00)

------------------------------------------------------------

CURRENT PRICES & 24H RANGES:

  BTC      | $111,976.00 (-6.32% in 24h)
             24h range: $105,896.00 - $117,583.00

------------------------------------------------------------

Timestamp: 2025/10/12 02:30:15 (Asia/Shanghai)

============================================================

This is an automated alert from your crypto volatility monitoring service.
The system monitors 24-hour price changes every 5 minutes using CoinGecko API.
```

## ? ����

1. **���ɿ�**��CoinGecko �� GitHub Actions �б����ȶ�
2. **����**������Ҫ��ȡ���̼ۣ�K�����ݣ�
3. **������**������ API ���û�ȡ��������
4. **������**��CoinGecko ��� API ���Ƹ�����
5. **��ȫ��**������ 24h �ߵͼ���Ϣ

## ?? ע������

### 1. ������ڱ仯
- **֮ǰ**��ÿ�� 00:00 ���ã���شӿ��̵���ǰ���ǵ�
- **����**��������� 24 Сʱ�����ǵ���

����ζ�Ŵ���ʱ����ܲ�ͬ��������߼���ͬ��6%, 8%, 10% ...��

### 2. ״̬�ļ�������
�״������´���ʱ�����Զ������¸�ʽ��״̬�ļ����ɵ�״̬�ļ��ᱻ�滻��

### 3. API ��������
CoinGecko ��� API ���ƣ�
- ÿ���� 10-50 ������
- ����ÿ 5 ����ֻ���� 1 �Σ���ȫ��������

## ? ��λ��ˣ�

�����Ҫ���˵� Binance API��

```bash
git revert HEAD
git push
```

�������ȼ�� GitHub Actions ��־�������Ƿ����������⡣

## ? ����ĵ�

- [CoinGecko API �ĵ�](https://www.coingecko.com/en/api/documentation)
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - �����Ų�
- [README.md](README.md) - ʹ��˵��

## ? ��������

### Q: Ϊʲô���޸� Binance API �����⣿
A: ���ⲻ�����ǵĴ��룬���� GitHub Actions �����绷���������Ѿ������ˣ�
- ���ӳ�ʱʱ�䵽 30 ��
- ��� 3 �����Ի���
- ����ʽ�ӳ�
��������Ȼ���ڡ��л��� CoinGecko �Ǹ�ʵ�õĽ��������

### Q: 24 Сʱģʽ������ģʽ��ʲô����
A: 
- **����ģʽ**��ÿ�� 00:00 ���ã���ص��մӿ��̵����ڵı仯
- **24h ģʽ**������������ 24 Сʱ�Ĺ����仯

���磺
- ����ģʽ������ 10:00 ����ڽ��� 00:00 �ı仯
- 24h ģʽ������ 10:00 ��������� 10:00 �ı仯

### Q: ��Ӱ��澯��׼ȷ����
A: ���ᡣ����ģʽ����׼ȷ��ز������ȡ�24h ģʽ���������ϼ��ܻ����г����ص㣨7x24 Сʱ���ף���

### Q: ���ݸ���Ƶ���Ƕ��٣�
A: CoinGecko ���ݸ���Ƶ��Լ 1-2 ���ӣ�����ÿ 5 ���Ӽ��һ�Σ���ȫ�㹻��

## ? ��Ҫ������

����������⣺
1. �鿴 [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. ���� `node test-coingecko.js` ���� API
3. ��� GitHub Actions ��־
4. �ڲֿ��ύ Issue

