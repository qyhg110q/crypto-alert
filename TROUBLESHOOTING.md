# �����Ų�ָ��

## �۸��ȡʧ������

����ڲ����ʼ��п��� `[Failed to fetch]`���밴���²����Ų飺

### 1. �鿴 GitHub Actions ��־

**������鿴��**
1. ���ʲֿ⣺https://github.com/qyhg110q/crypto-alert
2. ��������� **"Actions"** ��ǩҳ
3. �ҵ�������е� workflow���� "Test Email"��
4. ������룬�鿴��ϸ��־
5. չ�� "Send test email with current prices" ����

**��Ҫ��־��Ϣ��**
- `[Attempt 1/3] Fetching price from: https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT`
- `Status: 200 OK` �������Ϣ
- `Response body:` ���������
- �κγ�ʱ���������

### 2. ���ز��� API ����

���б��ز��Խű���֤ Binance API �Ƿ�������

```bash
node test-price.js
```

**Ԥ�������**
```
============================================================
Binance API Price Fetching Test
============================================================

=== Testing BTCUSDT ===
URL: https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT
Fetching...
Status: 200 OK
Response data: { symbol: 'BTCUSDT', price: '111922.06000000' }
? Success! Price: $111922.06

...
```

### 3. �������⼰�������

#### ���� 1������ʱ (Request timeout)
**֢״��** ��־��ʾ `Request timeout for BTCUSDT after XXXms`

**ԭ��** GitHub Actions ������������

**���������** ��ʵʩ
- ? ��ʱʱ��� 10 �����ӵ� 30 ��
- ? �Զ����� 3 ��
- ? ����ʽ�ӳ٣�2�롢4�롢6�룩

#### ���� 2��API ���� (Rate Limit)
**֢״��** ��־��ʾ `429 Too Many Requests`

**ԭ��** �������Ƶ��

**���������** ��ʵʩ
- ? ������ 500ms
- ? ���Լ������ʽ����

#### ���� 3����������ʧ��
**֢״��** ��־��ʾ `fetch failed` �� `ENOTFOUND`

**ԭ��** GitHub Actions �޷����� Binance API

**���������**
1. �ٴ����� workflow����������ʱ�������⣩
2. ��� Binance API ״̬��https://www.binance.com/en/support/announcement
3. �������ʧ�ܣ�������Ҫʹ�ô������ API

#### ���� 4����Ӧ��ʽ����
**֢״��** ��־��ʾ `Invalid data format`

**ԭ��** Binance API �����˷�Ԥ�ڸ�ʽ

**���������**
1. �����־�е� `Response body` ����
2. ȷ��ʹ�õ����������׶Ը�ʽ��BTCUSDT ���� BTC��
3. ��ϵά���߱�������

### 4. ��֤ API �˵��ʽ

**? ��ȷ��ʽ��**
```
https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT
https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT
https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT
```

**? �����ʽ��**
```
https://api.binance.com/api/v3/ticker/price?symbol=BTC    �� ȱ�� USDT
https://api.binance.com/api/v3/ticker/price?symbol=btcusdt �� Сд
```

### 5. �ֶ����� API

��� GitHub Actions ʧ�ܵ����سɹ��������ֶ����� API��

```bash
# Windows PowerShell
Invoke-WebRequest "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"

# Linux/Mac
curl "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
```

**Ԥ����Ӧ��**
```json
{"symbol":"BTCUSDT","price":"111922.06000000"}
```

### 6. ��ǰ���Բ���

������ʵ�������ݴ���ƣ�

1. **��ʱʱ�䣺** 30 ��
2. **���Դ�����** 3 ��
3. **�����ӳ٣�**
   - �� 1 ��ʧ�ܺ�ȴ� 2 ��
   - �� 2 ��ʧ�ܺ�ȴ� 4 ��
   - �� 3 ��ʧ�������
4. **��������** ÿ�����׶�֮���� 500ms

### 7. ��Ҫ������

������ϲ����޷�������⣺

1. **�ռ���Ϣ��**
   - GitHub Actions ������־
   - ���ز��Խ����`node test-price.js`��
   - �ֶ� curl ���Խ��

2. **��黷����**
   - �Ƿ����������б���� Secrets��
   - ���绷���Ƿ��ܷ��� Binance��

3. **�ύ Issue��**
   - �� GitHub �ֿ��ύ Issue
   - �����ռ�����Ϣ����־

## �ʼ�����ʧ������

����ʼ�����ʧ�ܣ���鿴 [FAQ.md](FAQ.md) �е�"�ʼ���������"���֡�

## ��������

����������ο���
- [README.md](README.md) - ����ʹ��˵��
- [FAQ.md](FAQ.md) - ����������
- [DEPLOYMENT.md](DEPLOYMENT.md) - ����ָ��

