# 加密货币日内波动告警服务

自动监控加密货币的日内波动，当达到设定阈值时通过邮件发送告警通知。

## 功能特性

- ? **监控主流币种**：默认监控 BTCUSDT、ETHUSDT、BNBUSDT
- ? **智能阈值告警**：首次 6% 告警，之后每 2% 递增（8%、10%、12%...）
- ? **每日自动重置**：每天 Asia/Shanghai 时区 00:00 自动重置统计
- ? **邮件即时通知**：通过 Resend 发送告警邮件
- ?? **GitHub Actions 部署**：无需服务器，完全托管在 GitHub
- ? **状态持久化**：自动保存状态，避免重复告警

## 工作原理

1. 每天 00:00（Asia/Shanghai）获取当日开盘价作为基准
2. 定期（默认每 5 分钟）从币安获取最新价格
3. 计算相对开盘价的涨跌幅
4. 当涨跌幅绝对值达到阈值时发送邮件告警
5. 状态自动保存到仓库，下次运行时继续使用

## 快速开始

### 1. Fork 本仓库

点击右上角 **Fork** 按钮，将仓库复制到你的 GitHub 账号下。

### 2. 获取 Resend API Key

1. 访问 [Resend](https://resend.com/) 并注册账号
2. 在控制台创建 API Key
3. 添加并验证你的发件域名（或使用 Resend 提供的测试域名）

### 3. 配置 GitHub Secrets

在你的仓库中，进入 **Settings → Secrets and variables → Actions**，添加以下 Secrets：

| Secret Name | 描述 | 示例 |
|------------|------|------|
| `RESEND_API_KEY` | Resend API 密钥 | `re_xxxxxxxxxxxxx` |
| `EMAIL_TO` | 收件人邮箱 | `your-email@example.com` |
| `EMAIL_FROM` | 发件人邮箱（需在 Resend 中验证） | `alerts@yourdomain.com` |

### 4. （可选）自定义监控币种

在 **Settings → Secrets and variables → Actions → Variables** 标签页中，添加变量：

| Variable Name | 描述 | 默认值 |
|--------------|------|--------|
| `SYMBOLS` | 监控的交易对（逗号分隔） | `BTCUSDT,ETHUSDT,BNBUSDT` |

### 5. 启用 GitHub Actions

1. 进入仓库的 **Actions** 标签页
2. 如果看到提示，点击 **I understand my workflows, go ahead and enable them**
3. 工作流将在下一个 5 分钟整点自动运行

### 6. 手动触发测试

进入 **Actions** → **Crypto Volatility Alert** → **Run workflow** 进行手动测试。

## 本地开发

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_TO=your-email@example.com
EMAIL_FROM=alerts@yourdomain.com
SYMBOLS=BTCUSDT,ETHUSDT,BNBUSDT
```

### 运行

```bash
npm start
```

## 配置说明

### 修改检查频率

编辑 `.github/workflows/volatility-alert.yml` 中的 cron 表达式：

```yaml
schedule:
  - cron: '*/5 * * * *'  # 每 5 分钟运行一次
```

常用配置：
- `*/5 * * * *` - 每 5 分钟
- `*/10 * * * *` - 每 10 分钟
- `*/15 * * * *` - 每 15 分钟
- `0 * * * *` - 每小时整点

### 修改阈值配置

编辑 `src/index.js` 中的常量：

```javascript
const INITIAL_THRESHOLD = 6;  // 首次告警阈值（%）
const THRESHOLD_STEP = 2;      // 阈值递增步长（%）
```

### 修改时区

编辑 `src/index.js` 中的时区配置：

```javascript
const TIMEZONE = 'Asia/Shanghai';  // 或其他 IANA 时区
```

## 邮件示例

**主题：**
```
[Volatility Alert] Reached 8% intraday (Up) - 2025-10-11
```

**内容：**
```
Crypto Volatility Alert
==================================================

BTCUSDT hit 6% threshold (now +6.34%, price 68001.23, open 63990.00)
BTCUSDT hit 8% threshold (now +8.12%, price 69123.45, open 63990.00)

---
This is an automated alert from your crypto volatility monitoring service.
```

## 目录结构

```
.
├── .github/
│   └── workflows/
│       └── volatility-alert.yml   # GitHub Actions 工作流
├── .data/
│   └── state.json                 # 状态持久化文件（自动生成）
├── src/
│   ├── index.js                   # 主程序入口
│   ├── binance.js                 # 币安 API 封装
│   ├── time.js                    # 时间处理工具
│   ├── state.js                   # 状态管理
│   └── notifier.js                # 邮件通知
├── package.json                   # 项目配置
├── .env.example                   # 环境变量模板
└── README.md                      # 说明文档
```

## 故障排查

### 工作流运行失败

1. 检查 Secrets 是否正确配置
2. 查看 Actions 日志中的错误信息
3. 确保 `EMAIL_FROM` 域名已在 Resend 中验证

### 没有收到邮件

1. 检查垃圾邮件文件夹
2. 确认 Resend API Key 有效
3. 查看 Actions 日志确认是否达到阈值

### 状态文件提交失败

确保仓库的 Actions 有写权限：
**Settings → Actions → General → Workflow permissions** 选择 **Read and write permissions**

## 技术栈

- **运行环境**：Node.js 20
- **时区处理**：Luxon
- **邮件服务**：Resend
- **数据源**：Binance 公共 API（无需密钥）
- **部署平台**：GitHub Actions

## 数据源说明

本项目使用币安公共 API，无需任何账号或密钥：
- 实时价格：`/api/v3/ticker/price`
- K线数据：`/api/v3/klines`

## 注意事项

- ? GitHub Actions 免费账户每月有 2000 分钟配额，本项目每月约使用 150 分钟
- ? Resend 免费账户每月可发送 100 封邮件
- ? 仓库必须是公开的才能使用免费的 GitHub Actions（或使用 GitHub Pro）
- ? 时区设置为 Asia/Shanghai，每天 00:00 重置统计

## License

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

