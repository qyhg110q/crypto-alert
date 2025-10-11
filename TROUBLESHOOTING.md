# 故障排查指南

## 价格获取失败问题

如果在测试邮件中看到 `[Failed to fetch]`，请按以下步骤排查：

### 1. 查看 GitHub Actions 日志

**在哪里查看：**
1. 访问仓库：https://github.com/qyhg110q/crypto-alert
2. 点击顶部的 **"Actions"** 标签页
3. 找到最近运行的 workflow（如 "Test Email"）
4. 点击进入，查看详细日志
5. 展开 "Send test email with current prices" 步骤

**重要日志信息：**
- `[Attempt 1/3] Fetching price from: https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT`
- `Status: 200 OK` 或错误信息
- `Response body:` 后面的内容
- 任何超时或网络错误

### 2. 本地测试 API 连接

运行本地测试脚本验证 Binance API 是否正常：

```bash
node test-price.js
```

**预期输出：**
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

### 3. 常见问题及解决方案

#### 问题 1：请求超时 (Request timeout)
**症状：** 日志显示 `Request timeout for BTCUSDT after XXXms`

**原因：** GitHub Actions 服务器网络慢

**解决方案：** 已实施
- ? 超时时间从 10 秒增加到 30 秒
- ? 自动重试 3 次
- ? 渐进式延迟（2秒、4秒、6秒）

#### 问题 2：API 限流 (Rate Limit)
**症状：** 日志显示 `429 Too Many Requests`

**原因：** 请求过于频繁

**解决方案：** 已实施
- ? 请求间隔 500ms
- ? 重试间隔渐进式增加

#### 问题 3：网络连接失败
**症状：** 日志显示 `fetch failed` 或 `ENOTFOUND`

**原因：** GitHub Actions 无法访问 Binance API

**解决方案：**
1. 再次运行 workflow（可能是临时网络问题）
2. 检查 Binance API 状态：https://www.binance.com/en/support/announcement
3. 如果持续失败，可能需要使用代理或备用 API

#### 问题 4：响应格式错误
**症状：** 日志显示 `Invalid data format`

**原因：** Binance API 返回了非预期格式

**解决方案：**
1. 检查日志中的 `Response body` 内容
2. 确认使用的是完整交易对格式（BTCUSDT 不是 BTC）
3. 联系维护者报告问题

### 4. 验证 API 端点格式

**? 正确格式：**
```
https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT
https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT
https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT
```

**? 错误格式：**
```
https://api.binance.com/api/v3/ticker/price?symbol=BTC    ← 缺少 USDT
https://api.binance.com/api/v3/ticker/price?symbol=btcusdt ← 小写
```

### 5. 手动测试 API

如果 GitHub Actions 失败但本地成功，可以手动测试 API：

```bash
# Windows PowerShell
Invoke-WebRequest "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"

# Linux/Mac
curl "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
```

**预期响应：**
```json
{"symbol":"BTCUSDT","price":"111922.06000000"}
```

### 6. 当前重试策略

代码已实现以下容错机制：

1. **超时时间：** 30 秒
2. **重试次数：** 3 次
3. **重试延迟：**
   - 第 1 次失败后等待 2 秒
   - 第 2 次失败后等待 4 秒
   - 第 3 次失败则放弃
4. **请求间隔：** 每个交易对之间间隔 500ms

### 7. 需要帮助？

如果以上步骤无法解决问题：

1. **收集信息：**
   - GitHub Actions 完整日志
   - 本地测试结果（`node test-price.js`）
   - 手动 curl 测试结果

2. **检查环境：**
   - 是否配置了所有必需的 Secrets？
   - 网络环境是否能访问 Binance？

3. **提交 Issue：**
   - 在 GitHub 仓库提交 Issue
   - 附上收集的信息和日志

## 邮件发送失败问题

如果邮件功能失败，请查看 [FAQ.md](FAQ.md) 中的"邮件发送问题"部分。

## 其他问题

更多问题请参考：
- [README.md](README.md) - 基本使用说明
- [FAQ.md](FAQ.md) - 常见问题解答
- [DEPLOYMENT.md](DEPLOYMENT.md) - 部署指南

