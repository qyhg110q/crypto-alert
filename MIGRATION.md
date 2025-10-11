# API 迁移说明：从 Binance 到 CoinGecko

## ? 为什么要迁移？

在测试过程中发现，**Binance API 在 GitHub Actions 环境中经常失败**，主要原因：
- GitHub Actions 服务器的 IP 可能被 Binance 限流
- 网络延迟导致频繁超时
- 连接不稳定

经过测试，**CoinGecko API 在 GitHub Actions 中表现稳定**，因此进行了迁移。

## ? 主要变更

### 1. API 提供商
- **之前**：Binance Public API
- **现在**：CoinGecko API

### 2. 监控模式
- **之前**：本地日内涨跌幅（相对于 Asia/Shanghai 00:00 的开盘价）
- **现在**：24 小时滚动涨跌幅

### 3. 数据源
**之前（Binance）：**
```
实时价格: /api/v3/ticker/price?symbol=BTCUSDT
开盘价: /api/v3/klines?symbol=BTCUSDT&interval=1m&startTime=...
```

**现在（CoinGecko）：**
```
市场数据: /api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin&price_change_percentage=24h
```

### 4. 交易对映射
```javascript
BTCUSDT → bitcoin (CoinGecko ID)
ETHUSDT → ethereum (CoinGecko ID)
BNBUSDT → binancecoin (CoinGecko ID)
```

## ? 新增功能

### 24 小时价格范围
邮件通知中现在包含：
- 当前价格
- 24 小时涨跌幅
- 24 小时最高价
- 24 小时最低价

### 更好的错误处理
- 3 次自动重试
- 渐进式延迟（2秒、4秒、6秒）
- 30 秒超时

## ? 代码变更

### 新增文件
- `src/coingecko.js` - CoinGecko API 客户端
- `test-coingecko.js` - CoinGecko API 测试脚本

### 修改文件
- `src/index.js` - 主逻辑改用 CoinGecko
- `src/state.js` - 添加 24h 模式支持
- `src/notifier.js` - 邮件格式更新
- `src/test-email.js` - 测试邮件改用 CoinGecko

### 保留文件（可选删除）
- `src/binance.js` - 保留作为参考，可以删除
- `test-price.js` - Binance 测试脚本，可以删除

## ? 配置变更

**无需更改！** 环境变量保持不变：
```
RESEND_API_KEY=your_key
EMAIL_TO=your@email.com
EMAIL_FROM=noreply@yourdomain.com
SYMBOLS=BTCUSDT,ETHUSDT,BNBUSDT  # 可选，默认这三个
```

## ? 状态文件变更

**旧格式（Binance）：**
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

**新格式（CoinGecko）：**
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

> 注意：不再需要存储 `openPrice`，因为使用 CoinGecko 的 24 小时变化百分比

## ? 测试步骤

### 1. 本地测试 CoinGecko API
```bash
node test-coingecko.js
```

应该看到类似输出：
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

### 2. 测试邮件发送
在 GitHub Actions 中手动运行 **Test Email** workflow，或本地运行：
```bash
npm run test-email
```

### 3. 测试完整监控
```bash
npm start
```

## ? 邮件格式变化

**示例邮件（新格式）：**
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

## ? 优势

1. **更可靠**：CoinGecko 在 GitHub Actions 中表现稳定
2. **更简单**：不需要获取开盘价（K线数据）
3. **更快速**：单次 API 调用获取所有数据
4. **无限流**：CoinGecko 免费 API 限制更宽松
5. **更全面**：包含 24h 高低价信息

## ?? 注意事项

### 1. 监控周期变化
- **之前**：每天 00:00 重置，监控从开盘到当前的涨跌
- **现在**：持续监控 24 小时滚动涨跌幅

这意味着触发时间可能不同，但监控逻辑相同（6%, 8%, 10% ...）

### 2. 状态文件兼容性
首次运行新代码时，会自动创建新格式的状态文件。旧的状态文件会被替换。

### 3. API 速率限制
CoinGecko 免费 API 限制：
- 每分钟 10-50 次请求
- 我们每 5 分钟只请求 1 次，完全在限制内

## ? 如何回退？

如果需要回退到 Binance API：

```bash
git revert HEAD
git push
```

但建议先检查 GitHub Actions 日志，看看是否还有网络问题。

## ? 相关文档

- [CoinGecko API 文档](https://www.coingecko.com/en/api/documentation)
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - 故障排查
- [README.md](README.md) - 使用说明

## ? 常见问题

### Q: 为什么不修复 Binance API 的问题？
A: 问题不在我们的代码，而是 GitHub Actions 的网络环境。我们已经尝试了：
- 增加超时时间到 30 秒
- 添加 3 次重试机制
- 渐进式延迟
但问题依然存在。切换到 CoinGecko 是更实用的解决方案。

### Q: 24 小时模式和日内模式有什么区别？
A: 
- **日内模式**：每天 00:00 重置，监控当日从开盘到现在的变化
- **24h 模式**：持续监控最近 24 小时的滚动变化

例如：
- 日内模式：今天 10:00 相对于今天 00:00 的变化
- 24h 模式：今天 10:00 相对于昨天 10:00 的变化

### Q: 会影响告警的准确性吗？
A: 不会。两种模式都能准确监控波动幅度。24h 模式甚至更符合加密货币市场的特点（7x24 小时交易）。

### Q: 数据更新频率是多少？
A: CoinGecko 数据更新频率约 1-2 分钟，我们每 5 分钟检查一次，完全足够。

## ? 需要帮助？

如果遇到问题：
1. 查看 [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. 运行 `node test-coingecko.js` 测试 API
3. 检查 GitHub Actions 日志
4. 在仓库提交 Issue

