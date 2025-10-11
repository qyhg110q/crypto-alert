# 项目总览

## ? 项目信息

**项目名称：** 加密货币日内波动告警服务  
**英文名称：** Crypto Intraday Volatility Alerts  
**版本：** 1.0.0  
**开源协议：** MIT License  
**部署平台：** GitHub Actions  
**运行时：** Node.js 20+

## ? 核心功能

监控加密货币（BTC、ETH、BNB 等）的**日内价格波动**，当涨跌幅达到预设阈值时自动发送邮件告警。

### 特色亮点

1. **智能阶梯式告警**
   - 首次触发：6%
   - 第二次触发：8%
   - 第三次触发：10%
   - 以此类推，每次递增 2%

2. **补齐式阈值推进**
   - 一次运行跨越多个阈值时，不会遗漏任何告警
   - 例如：从 5% 涨到 9.5%，会同时触发 6% 和 8% 两次告警

3. **每日自动重置**
   - 基于 Asia/Shanghai 时区
   - 每天 00:00 重新计算开盘价，重置阈值
   - 符合传统金融市场的日内统计习惯

4. **完全免费运行**
   - 使用公开仓库，GitHub Actions 无限免费
   - 币安公共 API，无需账号和密钥
   - Resend 免费 100 封邮件/月

5. **零维护成本**
   - 无需服务器
   - 无需数据库
   - 状态自动保存到 Git 仓库

## ? 文件结构

```
CoinsListening/
├── .github/
│   └── workflows/
│       └── volatility-alert.yml       # GitHub Actions 工作流
├── .data/
│   ├── .gitkeep                       # 目录占位符
│   └── state.example.json             # 状态文件示例
├── src/
│   ├── index.js                       # 主程序入口
│   ├── time.js                        # 时区处理（Luxon）
│   ├── binance.js                     # 币安 API 客户端
│   ├── state.js                       # 状态管理（读写 JSON）
│   └── notifier.js                    # 邮件通知（Resend）
├── .gitattributes                     # Git 属性配置
├── .gitignore                         # Git 忽略规则
├── ARCHITECTURE.md                    # 技术架构说明
├── CHANGELOG.md                       # 版本更新日志
├── DEPLOYMENT.md                      # 详细部署指南
├── FAQ.md                             # 常见问题解答
├── LICENSE                            # MIT 开源协议
├── package.json                       # Node.js 项目配置
├── PROJECT_SUMMARY.md                 # 本文件
├── QUICKSTART.md                      # 5 分钟快速开始
├── README.md                          # 项目介绍
└── test-config.js                     # 配置验证脚本
```

## ? 技术栈

| 类型 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 运行时 | Node.js | 20+ | JavaScript 执行环境 |
| 时区处理 | Luxon | 3.4.4 | Asia/Shanghai 时区计算 |
| 邮件服务 | Resend | 3.2.0 | 发送告警邮件 |
| 数据源 | Binance API | - | 获取实时价格和 K 线数据 |
| 部署平台 | GitHub Actions | - | 定时执行脚本 |
| 状态存储 | Git 仓库 | - | 持久化状态文件 |

## ? 快速开始

### 1. Fork 仓库
点击右上角 **Fork** 按钮

### 2. 获取 Resend API Key
访问 https://resend.com/signup 注册并创建 API Key

### 3. 配置 GitHub Secrets
在仓库 **Settings → Secrets and variables → Actions** 添加：
- `RESEND_API_KEY`
- `EMAIL_TO`
- `EMAIL_FROM`

### 4. 启用 Actions 写权限
在仓库 **Settings → Actions → General → Workflow permissions** 选择 **Read and write permissions**

### 5. 启用工作流
进入 **Actions** 标签页，点击 **Enable workflows**

### 6. 手动测试
在 **Actions** 页面，点击 **Run workflow** 进行测试

详细步骤见：[QUICKSTART.md](./QUICKSTART.md)

## ? 工作原理

```
┌──────────────────────────────────────────────────────────┐
│  每 5 分钟执行一次（GitHub Actions Cron）                │
└────────────────────────┬─────────────────────────────────┘
                         │
         ┌───────────────▼───────────────┐
         │ 1. 计算当前日期和时区         │
         │    (Asia/Shanghai)            │
         └───────────────┬───────────────┘
                         │
         ┌───────────────▼───────────────┐
         │ 2. 读取状态文件               │
         │    .data/state.json           │
         └───────────────┬───────────────┘
                         │
         ┌───────────────▼───────────────┐
         │ 3. 检查是否新的一天           │
         │    是：获取开盘价，重置阈值   │
         │    否：继续使用现有状态       │
         └───────────────┬───────────────┘
                         │
         ┌───────────────▼───────────────┐
         │ 4. 获取实时价格               │
         │    (Binance API)              │
         └───────────────┬───────────────┘
                         │
         ┌───────────────▼───────────────┐
         │ 5. 计算涨跌幅                 │
         │    pct = (现价-开盘)/开盘*100 │
         └───────────────┬───────────────┘
                         │
         ┌───────────────▼───────────────┐
         │ 6. 判断是否达到阈值           │
         │    是：记录触发，递增阈值     │
         │    否：跳过                   │
         └───────────────┬───────────────┘
                         │
         ┌───────────────▼───────────────┐
         │ 7. 发送邮件告警               │
         │    (Resend API)               │
         └───────────────┬───────────────┘
                         │
         ┌───────────────▼───────────────┐
         │ 8. 保存更新后的状态           │
         │    并提交到 Git 仓库          │
         └───────────────────────────────┘
```

## ? 邮件示例

### 主题
```
[Volatility Alert] Reached 8% intraday (Up) - 2025-10-11
```

### 内容
```
Crypto Volatility Alert
==================================================

BTCUSDT hit 6% threshold (now +6.34%, price 68001.23, open 63990.00)
BTCUSDT hit 8% threshold (now +8.12%, price 69123.45, open 63990.00)

---
This is an automated alert from your crypto volatility monitoring service.
```

## ?? 可配置项

### 环境变量（GitHub Secrets/Variables）

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `RESEND_API_KEY` | ? | - | Resend API 密钥 |
| `EMAIL_TO` | ? | - | 收件人邮箱 |
| `EMAIL_FROM` | ? | - | 发件人邮箱 |
| `SYMBOLS` | ? | BTCUSDT,ETHUSDT,BNBUSDT | 监控的交易对 |

### 代码常量（需修改源代码）

| 常量 | 文件 | 默认值 | 说明 |
|------|------|--------|------|
| `TIMEZONE` | src/index.js | Asia/Shanghai | 时区 |
| `INITIAL_THRESHOLD` | src/index.js | 6 | 首次告警阈值 (%) |
| `THRESHOLD_STEP` | src/index.js | 2 | 阈值递增步长 (%) |

### 运行频率（修改 workflow）

| Cron 表达式 | 频率 |
|-------------|------|
| `*/5 * * * *` | 每 5 分钟（默认） |
| `*/10 * * * *` | 每 10 分钟 |
| `*/15 * * * *` | 每 15 分钟 |
| `0 * * * *` | 每小时 |

## ? 成本分析

### 使用公开仓库（推荐）

| 服务 | 免费额度 | 本项目用量 | 费用 |
|------|----------|------------|------|
| GitHub Actions | 无限 | ~150 分钟/月 | **?0** |
| Binance API | 1200 请求/分钟 | <1 请求/分钟 | **?0** |
| Resend 邮件 | 100 封/月 | 约 10-30 封/月 | **?0** |
| **总计** | - | - | **?0** |

### 使用私有仓库

| 服务 | 免费额度 | 本项目用量 | 费用 |
|------|----------|------------|------|
| GitHub Actions | 2000 分钟/月 | ~150 分钟/月 | **?0** |
| Binance API | 1200 请求/分钟 | <1 请求/分钟 | **?0** |
| Resend 邮件 | 100 封/月 | 约 10-30 封/月 | **?0** |
| **总计** | - | - | **?0** |

> 注：私有仓库的 Actions 配额足够，但如果监控大量币种或提高频率，可能会超限。

## ? 安全性

### ? 安全措施

- 无需交易所账号或 API 密钥
- 仅使用公开的只读行情 API
- 无任何交易权限
- 敏感配置存储在 GitHub Secrets（加密）
- API Key 仅有邮件发送权限，无其他权限

### ?? 注意事项

- 状态文件（`.data/state.json`）会提交到仓库
  - 包含：币种、开盘价、阈值进度
  - 不包含：个人信息、密钥、账号
- 如需完全私密，使用私有仓库
- 邮件内容包含价格信息，注意邮箱安全

## ? 性能指标

### API 调用量

| 场景 | Binance API 调用 | Resend API 调用 |
|------|------------------|-----------------|
| 日切时（每天 1 次） | N × 1 次 klines（N=币种数） | 0 |
| 正常运行（每 5 分钟） | N × 1 次 price | 0 |
| 触发告警 | N × 1 次 price | 1 次 email |

**每天总计：**
- Binance：N × (1 + 287) ≈ 864 次（N=3）
- Resend：约 0-10 次

### 运行时间

- 平均运行时间：20-40 秒
- 主要耗时：
  - API 调用：15-25 秒
  - 状态文件读写：1-3 秒
  - Git 提交推送：5-10 秒

### Actions 配额消耗

- 每次运行：约 0.5 分钟
- 每天运行：288 次
- 每月消耗：约 144 分钟（远低于 2000 分钟限制）

## ? 文档导航

| 文档 | 适合人群 | 内容 |
|------|----------|------|
| [README.md](./README.md) | 所有人 | 项目介绍、功能说明、配置指南 |
| [QUICKSTART.md](./QUICKSTART.md) | 新手 | 5 分钟快速部署教程 |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | 需要详细步骤 | 完整部署流程、故障排查 |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 开发者 | 技术架构、代码结构、算法说明 |
| [FAQ.md](./FAQ.md) | 遇到问题 | 常见问题和解决方案 |
| [CHANGELOG.md](./CHANGELOG.md) | 关注更新 | 版本历史和变更记录 |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | 全面了解 | 项目总览（本文件） |

## ?? 故障排查速查表

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| Actions 失败 | Secret 未配置 | 检查 3 个 Secret 是否正确 |
| 收不到邮件 | 进了垃圾箱 | 检查垃圾邮件文件夹 |
| 状态文件未提交 | 无写权限 | 开启 Actions 写权限 |
| Resend 403 错误 | 域名未验证 | 使用 onboarding@resend.dev 或验证域名 |
| 币安 API 失败 | 网络问题 | 等待自动重试，或检查币安状态 |

详细排查见：[FAQ.md](./FAQ.md)

## ? 自定义扩展

### 添加监控币种
在 GitHub Variables 添加 `SYMBOLS`：
```
BTCUSDT,ETHUSDT,BNBUSDT,SOLUSDT,ADAUSDT,XRPUSDT
```

### 修改告警阈值
编辑 `src/index.js`：
```javascript
const INITIAL_THRESHOLD = 10;  // 10% 起
const THRESHOLD_STEP = 5;      // 每次 5% 递增
```

### 自定义邮件模板
编辑 `src/notifier.js` 中的 `buildSubject` 和 `buildBody` 函数

### 添加 Telegram 通知
在 `src/notifier.js` 中添加 Telegram Bot API 调用

### 接入其他交易所
修改 `src/binance.js`，适配目标交易所的 API

## ? 适用场景

? **适合：**
- 个人投资者监控持仓波动
- 短线交易者捕捉日内机会
- 加密货币爱好者关注市场动态
- 学习 GitHub Actions 和 API 集成
- 构建低成本自动化告警系统

? **不适合：**
- 高频交易（延迟 5 分钟）
- 专业量化交易（需要更复杂的系统）
- 需要秒级响应的场景
- 需要历史数据分析和回测

## ? 贡献

欢迎提交：
- ? Bug 报告（GitHub Issues）
- ? 功能建议（GitHub Issues）
- ? 文档改进（Pull Request）
- ? 代码优化（Pull Request）

## ? 支持与反馈

- **文档**：查看本项目的 Markdown 文档
- **Issues**：https://github.com/YOUR_REPO/issues
- **Discussions**：https://github.com/YOUR_REPO/discussions

## ? 开源协议

MIT License - 可自由使用、修改、分发

---

**更新时间**：2025-10-11  
**版本**：1.0.0  
**维护状态**：? 活跃维护中

感谢使用！如有问题欢迎反馈。?

