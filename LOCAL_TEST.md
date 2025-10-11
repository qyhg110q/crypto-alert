# ���ز���ָ��

## ���ٲ����µ� CoinGecko API

### 1. ���� API ����

```bash
node test-coingecko.js
```

**Ԥ�������**
```
============================================================
CoinGecko API Test
============================================================
...
BITCOIN (BTC)
  Current Price: $112,002.00
  24h Change: -4.68%
  24h High: $117,583.00
  24h Low: $105,896.00
...
TEST PASSED!
============================================================
```

����������������˵�� CoinGecko API ����������?

### 2. ������������߼����������ʼ���

������ʱ���������ļ� `.env.test`��

```env
RESEND_API_KEY=dummy_key_for_test
EMAIL_TO=test@example.com
EMAIL_FROM=noreply@example.com
SYMBOLS=BTCUSDT,ETHUSDT,BNBUSDT
```

Ȼ�����У����ڼ�⵽��ֵʱ���Է��ʼ�������Ϊ�Ǽ���Կ���Ի�ʧ�ܣ����������ģ���

```bash
# Windows PowerShell
$env:RESEND_API_KEY="dummy"; $env:EMAIL_TO="test@test.com"; $env:EMAIL_FROM="noreply@test.com"; npm start

# Linux/Mac
RESEND_API_KEY=dummy EMAIL_TO=test@test.com EMAIL_FROM=noreply@test.com npm start
```

**Ԥ�ڿ�����**
```
=== Crypto Volatility Monitor Started ===
Using CoinGecko API for 24h price changes
Monitoring symbols: BTCUSDT, ETHUSDT, BNBUSDT
...
[Attempt 1/3] Fetching from CoinGecko: ...
   BTCUSDT: $112002, 24h: -4.68%
   ETHUSDT: $3818.58, 24h: -6.32%
   BNBUSDT: $1174.62, 24h: -4.68%
   Success! Fetched data for 3 symbols

Checking BTCUSDT...
Current price: $112002.00
24h change: -4.68%
...
```

### 3. �����ʼ����ͣ���Ҫ��ʵ Resend API Key��

������� Resend API Key�����Բ����������ʼ����͹��ܣ�

```bash
# Windows PowerShell
$env:RESEND_API_KEY="re_your_real_key_here"
$env:EMAIL_TO="your-email@example.com"
$env:EMAIL_FROM="noreply@yourdomain.com"  # �� "onboarding@resend.dev"
npm run test-email

# Linux/Mac
RESEND_API_KEY=re_your_real_key_here \
EMAIL_TO=your-email@example.com \
EMAIL_FROM=noreply@yourdomain.com \
npm run test-email
```

**Ԥ�ڿ�����**
```
=== Email Test Started ===

[OK] Environment variables configured
   From: noreply@yourdomain.com
   To: your-email@example.com

[INFO] Fetching current prices from CoinGecko...
[Attempt 1/3] Fetching from CoinGecko: ...
   BTCUSDT: $112002, 24h: -4.68%
   ETHUSDT: $3818.58, 24h: -6.32%
   BNBUSDT: $1174.62, 24h: -4.68%
   Success! Fetched data for 3 symbols
[OK] Market data fetched successfully

[INFO] Sending test email...
[OK] Test email sent successfully!
   Email ID: xxx-xxx-xxx

[INFO] Please check your inbox at: your-email@example.com

=== Email Test Completed ===
```

Ȼ����������䣨���������ʼ��ļ��У���

### 4. ��֤�ʼ�����

�����ʼ�Ӧ�ð�����

```
Hello!

This is a test email from your Crypto Volatility Alert Service.
Now using CoinGecko API for better reliability!

============================================================

CURRENT CRYPTOCURRENCY PRICES

------------------------------------------------------------

  BTC      | $112,002.00
             24h change: -4.68%
             24h range: $105,896.00 - $117,583.00

  ETH      | $3,818.58
             24h change: -6.32%
             24h range: $3,574.79 - $4,079.98

  BNB      | $1,174.62
             24h change: -4.68%
             24h range: $909.86 - $1,237.02

------------------------------------------------------------

...

  [OK] Email service: Working
  [OK] CoinGecko API: Working
  [OK] Price fetching: All OK

...
```

## ��������

### Q: test-coingecko.js �ɹ����� npm start ʧ�ܣ�

A: ����Ƿ������˻�����������ʹ�Ǽٵ�ֵҲҪ���ã�
```bash
$env:RESEND_API_KEY="dummy"
$env:EMAIL_TO="test@test.com"
$env:EMAIL_FROM="noreply@test.com"
```

### Q: ��ʾ "Cannot find package 'resend'"��

A: ���� `npm install` ��װ����

### Q: �����ʼ��ղ�����

A: ��飺
1. RESEND_API_KEY �Ƿ���ȷ
2. EMAIL_FROM �����Ƿ��� Resend ����֤
3. �����ʼ��ļ���
4. Resend ����̨�ķ�����־

### Q: GitHub Actions ������������

A: �ǵģ����ز��Գɹ���GitHub Actions Ӧ��Ҳ������������CoinGecko API �� GitHub Actions �����б��ֺ��ȶ���

## ��һ��

���ز��Զ�ͨ���󣬿��ԣ�

1. ? �ύ���뵽 GitHub
2. ? ���� GitHub Secrets��RESEND_API_KEY, EMAIL_TO, EMAIL_FROM��
3. ? �� Actions ҳ���ֶ����� "Test Email" workflow
4. ? �ȴ��Զ���ʱ����ÿ 5 ���ӣ����������ֶ����� "Volatility Alert" workflow

## ��Ҫ������

- �鿴 [README.md](README.md) �˽���������
- �鿴 [MIGRATION.md](MIGRATION.md) �˽� API Ǩ������
- �鿴 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) �Ų�����
- �� GitHub �ύ Issue

