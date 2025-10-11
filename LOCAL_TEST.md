# 本地测试指南

## 快速测试新的 CoinGecko API

### 1. 测试 API 连接

```bash
node test-coingecko.js
```

**预期输出：**
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

如果看到以上输出，说明 CoinGecko API 工作正常！?

### 2. 测试完整监控逻辑（不发送邮件）

创建临时环境变量文件 `.env.test`：

```env
RESEND_API_KEY=dummy_key_for_test
EMAIL_TO=test@example.com
EMAIL_FROM=noreply@example.com
SYMBOLS=BTCUSDT,ETHUSDT,BNBUSDT
```

然后运行（会在检测到阈值时尝试发邮件，但因为是假密钥所以会失败，这是正常的）：

```bash
# Windows PowerShell
$env:RESEND_API_KEY="dummy"; $env:EMAIL_TO="test@test.com"; $env:EMAIL_FROM="noreply@test.com"; npm start

# Linux/Mac
RESEND_API_KEY=dummy EMAIL_TO=test@test.com EMAIL_FROM=noreply@test.com npm start
```

**预期看到：**
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

### 3. 测试邮件发送（需要真实 Resend API Key）

如果你有 Resend API Key，可以测试完整的邮件发送功能：

```bash
# Windows PowerShell
$env:RESEND_API_KEY="re_your_real_key_here"
$env:EMAIL_TO="your-email@example.com"
$env:EMAIL_FROM="noreply@yourdomain.com"  # 或 "onboarding@resend.dev"
npm run test-email

# Linux/Mac
RESEND_API_KEY=re_your_real_key_here \
EMAIL_TO=your-email@example.com \
EMAIL_FROM=noreply@yourdomain.com \
npm run test-email
```

**预期看到：**
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

然后检查你的邮箱（包括垃圾邮件文件夹）！

### 4. 验证邮件内容

测试邮件应该包含：

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

## 常见问题

### Q: test-coingecko.js 成功，但 npm start 失败？

A: 检查是否设置了环境变量。即使是假的值也要设置：
```bash
$env:RESEND_API_KEY="dummy"
$env:EMAIL_TO="test@test.com"
$env:EMAIL_FROM="noreply@test.com"
```

### Q: 显示 "Cannot find package 'resend'"？

A: 运行 `npm install` 安装依赖

### Q: 测试邮件收不到？

A: 检查：
1. RESEND_API_KEY 是否正确
2. EMAIL_FROM 域名是否在 Resend 中验证
3. 垃圾邮件文件夹
4. Resend 控制台的发送日志

### Q: GitHub Actions 会正常工作吗？

A: 是的！本地测试成功后，GitHub Actions 应该也能正常工作。CoinGecko API 在 GitHub Actions 环境中表现很稳定。

## 下一步

本地测试都通过后，可以：

1. ? 提交代码到 GitHub
2. ? 配置 GitHub Secrets（RESEND_API_KEY, EMAIL_TO, EMAIL_FROM）
3. ? 在 Actions 页面手动运行 "Test Email" workflow
4. ? 等待自动定时任务（每 5 分钟）触发，或手动运行 "Volatility Alert" workflow

## 需要帮助？

- 查看 [README.md](README.md) 了解完整设置
- 查看 [MIGRATION.md](MIGRATION.md) 了解 API 迁移详情
- 查看 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) 排查问题
- 在 GitHub 提交 Issue

