# 常见问题 FAQ

## 基础问题

### Q1: 这个项目是做什么的？

监控加密货币（BTC、ETH、BNB 等）的日内价格波动，当涨跌幅达到 6%、8%、10% 等阈值时，自动发送邮件提醒。

### Q2: 需要花钱吗？

如果使用公开仓库，**完全免费**：
- GitHub Actions（公开仓库）：免费无限
- Binance API：免费公共接口
- Resend 邮件：免费 100 封/月（足够使用）

### Q3: 需要币安账号吗？

**不需要**。我们只使用币安的公共行情 API，无需注册、无需登录、无需 API 密钥。

### Q4: 安全吗？

**非常安全**：
- 无需交易所账号和密钥
- 无法进行任何交易操作
- 仅读取公开的价格数据
- 所有密钥存储在 GitHub Secrets 中

### Q5: 支持哪些币种？

支持币安所有现货交易对，默认监控：
- BTCUSDT（比特币）
- ETHUSDT（以太坊）
- BNBUSDT（币安币）

可自定义添加：SOLUSDT、ADAUSDT、DOTUSDT、XRPUSDT 等。

查看完整列表：https://www.binance.com/zh-CN/markets

---

## 部署问题

### Q6: Fork 后需要做什么？

三个核心步骤：
1. 获取 Resend API Key
2. 在 GitHub 仓库配置 3 个 Secrets（API Key、收件邮箱、发件邮箱）
3. 启用 Actions 写权限

详见：[QUICKSTART.md](./QUICKSTART.md)

### Q7: Resend 是什么？怎么注册？

Resend 是一个邮件发送服务（类似 SendGrid）。

注册步骤：
1. 访问 https://resend.com/signup
2. 使用邮箱注册（建议用接收告警的邮箱）
3. 登录后在 https://resend.com/api-keys 创建 API Key

完全免费，100 封/月足够使用。

### Q8: 发件邮箱怎么配置？

**方案 A（快速开始）：**
- 使用 Resend 测试域名
- 发件地址：`onboarding@resend.dev`
- 限制：只能发到注册 Resend 时用的邮箱

**方案 B（推荐）：**
- 使用自己的域名（如 `alerts@yourdomain.com`）
- 需要在域名 DNS 配置 MX、SPF、DKIM 记录
- 配置后可发到任意邮箱

详见：[DEPLOYMENT.md](./DEPLOYMENT.md)

### Q9: 私有仓库可以用吗？

可以，但会消耗 Actions 配额：
- 免费账户：2000 分钟/月
- 本项目每月约消耗：150 分钟（每 5 分钟运行）

**建议使用公开仓库**（无限免费）。状态文件不包含敏感信息。

---

## 配置问题

### Q10: 怎么修改监控的币种？

在 GitHub 仓库设置中：
1. **Settings** → **Secrets and variables** → **Actions**
2. 切换到 **Variables** 标签页
3. 添加变量 `SYMBOLS`，值如：`BTCUSDT,ETHUSDT,SOLUSDT,ADAUSDT`

### Q11: 怎么修改检查频率？

编辑 `.github/workflows/volatility-alert.yml`：

```yaml
schedule:
  - cron: '*/5 * * * *'   # 每 5 分钟（默认）
  - cron: '*/10 * * * *'  # 每 10 分钟
  - cron: '*/15 * * * *'  # 每 15 分钟
  - cron: '0 * * * *'     # 每小时
```

### Q12: 怎么修改告警阈值？

编辑 `src/index.js`：

```javascript
const INITIAL_THRESHOLD = 6;  // 改为 5、10 等
const THRESHOLD_STEP = 2;     // 改为 1、3、5 等
```

例如改为 10% 起，每次 5% 递增：
```javascript
const INITIAL_THRESHOLD = 10;
const THRESHOLD_STEP = 5;
```

### Q13: 怎么改时区？

编辑 `src/index.js`：

```javascript
const TIMEZONE = 'Asia/Shanghai';  // 改为其他 IANA 时区
```

常见时区：
- `Asia/Shanghai`（中国）
- `America/New_York`（纽约）
- `Europe/London`（伦敦）
- `Asia/Tokyo`（东京）

---

## 使用问题

### Q14: 多久会收到第一封邮件？

取决于市场波动：
- 波动大（如暴涨暴跌）：可能几小时内
- 波动小（横盘）：可能几天甚至更久

可以临时降低阈值测试（改为 1% 或 2%）。

### Q15: 为什么收不到邮件？

检查清单：
1. ? 检查垃圾邮件/促销邮件文件夹
2. ? 确认 Secrets 配置正确（无多余空格）
3. ? 如果用 `onboarding@resend.dev`，确认 `EMAIL_TO` 是注册邮箱
4. ? 查看 Actions 日志，确认是否达到阈值
5. ? 在 Resend 查看发送历史（https://resend.com/emails）

### Q16: 一天会收到多少封邮件？

不确定，取决于市场波动：
- 平静时：0 封
- 波动时：每个币种 1-5 封（6%、8%、10%...）
- 极端波动：可能更多

一封邮件可能包含多个告警（如同时触发 6% 和 8%）。

### Q17: 怎么暂停监控？

**方法 1（临时）：**
1. 进入 **Actions** 页面
2. 点击 **Crypto Volatility Alert**
3. 点击 `...` 菜单 → **Disable workflow**

**方法 2（永久）：**
- 删除仓库或 `.github/workflows/volatility-alert.yml` 文件

### Q18: 怎么恢复监控？

在 Actions 页面，找到工作流，点击 **Enable workflow**。

---

## 故障排查

### Q19: Actions 运行失败，显示 "Permission denied"

**原因：** 未开启 Actions 写权限

**解决：**
1. **Settings** → **Actions** → **General**
2. 滚动到 **Workflow permissions**
3. 选择 ? **Read and write permissions**
4. 点击 **Save**

### Q20: Resend 返回 403 错误

**可能原因：**
1. API Key 错误
2. 发件域名未验证

**解决：**
1. 重新检查 `RESEND_API_KEY` 是否正确
2. 在 Resend Domains 页面确认域名状态为 "Verified"
3. 或改用 `onboarding@resend.dev` 测试

### Q21: 币安 API 无法访问

**可能原因：**
1. 网络问题
2. 币安 API 维护
3. GitHub Actions IP 被限制

**解决：**
1. 查看 [币安公告](https://www.binance.com/en/support/announcement)
2. 等待几分钟后自动重试
3. 如果持续失败，检查币安 API 状态

### Q22: 状态文件没有自动提交

**原因：** 权限配置或 git 配置问题

**检查：**
1. 确认 Actions 写权限已开启（Q19）
2. 查看 Actions 日志中的 "Commit and push state changes" 步骤
3. 确认 `.data/state.json` 确实有变化

### Q23: 运行成功但什么都不输出

**这是正常的**，说明：
- ? 币安 API 调用成功
- ? 价格获取成功
- ? 未达到告警阈值
- ? 状态已保存

查看日志应该有类似输出：
```
? No thresholds crossed, no notification needed
```

---

## 进阶问题

### Q24: 可以监控合约/期货吗？

当前版本仅支持现货。如需合约数据，需修改 `src/binance.js` 中的 API 端点：
- 现货：`https://api.binance.com`
- 合约：`https://fapi.binance.com`

### Q25: 可以添加其他交易所吗？

可以，需要修改 `src/binance.js` 适配其他交易所 API，如：
- OKX：https://www.okx.com/docs-v5/
- Bybit：https://bybit-exchange.github.io/docs/
- Gate.io：https://www.gate.io/docs/developers/apiv4/

### Q26: 可以自定义邮件模板吗？

可以，编辑 `src/notifier.js` 中的 `buildSubject` 和 `buildBody` 函数。

示例：添加 HTML 格式
```javascript
await resend.emails.send({
  from: emailFrom,
  to: emailTo,
  subject: subject,
  html: buildHtmlBody(triggers)  // 自定义 HTML 模板
});
```

### Q27: 可以添加其他通知方式吗？

可以，在 `src/notifier.js` 中添加新函数：

```javascript
// Telegram Bot
export async function sendTelegram(triggers) {
  // 调用 Telegram Bot API
}

// Discord Webhook
export async function sendDiscord(triggers) {
  // 调用 Discord Webhook
}
```

### Q28: 可以保存历史数据吗？

当前版本只保存当日状态。如需历史数据，可以：
1. 在每次运行时将数据追加到 `.data/history.json`
2. 或接入数据库（如 Supabase、MongoDB Atlas 免费版）
3. 或使用 GitHub Issues 作为简单的数据存储

### Q29: 怎么本地开发和调试？

```bash
# 1. 克隆仓库
git clone https://github.com/YOUR_USERNAME/CoinsListening.git
cd CoinsListening

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的配置

# 4. 运行测试
npm run test-config

# 5. 运行主程序
npm start
```

### Q30: 可以用于生产环境吗？

可以，但建议：
1. ? 使用自己的域名发送邮件（更专业）
2. ? 监控 Resend 发送配额（避免超限）
3. ? 添加单元测试和集成测试
4. ? 配置告警（Actions 失败时通知）
5. ? 定期查看 Actions 日志确认运行正常

---

## 其他问题

### Q31: 数据从哪里来？

- **价格数据**：币安公共 API（无需账号）
- **开盘价**：每天 00:00 (Asia/Shanghai) 第一根 1 分钟 K 线

### Q32: 涨跌幅怎么计算？

```
涨跌幅 = (当前价格 - 开盘价) / 开盘价 × 100%
```

示例：
- 开盘价：10000
- 当前价格：10600
- 涨跌幅：(10600 - 10000) / 10000 × 100% = +6%

### Q33: 为什么基于"日内"而非 24 小时？

日内（00:00-23:59）更符合传统金融市场的统计习惯，便于：
- 每日复盘总结
- 对比不同日期的波动
- 与交易所显示的日涨跌幅对齐

### Q34: 状态文件会很大吗？

不会，每个币种只占几行：
```json
{
  "date": "2025-10-11",
  "tz": "Asia/Shanghai",
  "symbols": {
    "BTCUSDT": { "openPrice": 67890.12, "nextThresholdPct": 6 }
  }
}
```

10 个币种约 500 字节，可以忽略不计。

### Q35: 支持其他语言吗？

当前代码是英文+中文注释。邮件内容可以在 `src/notifier.js` 中改为任何语言。

### Q36: 有问题去哪里求助？

1. 查看本 FAQ
2. 查看 [README.md](./README.md)、[DEPLOYMENT.md](./DEPLOYMENT.md)
3. 查看 Actions 日志中的错误信息
4. 在 GitHub 提交 Issue

---

## 快速链接

- ? [README - 项目介绍](./README.md)
- ? [QUICKSTART - 5分钟快速开始](./QUICKSTART.md)
- ? [DEPLOYMENT - 详细部署指南](./DEPLOYMENT.md)
- ?? [ARCHITECTURE - 架构说明](./ARCHITECTURE.md)

还有问题？欢迎提交 Issue！

