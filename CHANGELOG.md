# 更新日志 (Changelog)

本文档记录项目的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.0] - 2025-10-11

### ? 首次发布

初始版本，实现核心功能。

### ? 新增功能

- **日内波动监控**：监控加密货币相对本地日内开盘价的涨跌幅
- **阶梯式告警**：首次 6% 告警，之后每 2% 递增（8%、10%、12%...）
- **补齐式阈值推进**：单次运行跨越多个阈值时，一次性触发所有告警
- **每日自动重置**：Asia/Shanghai 时区每日 00:00 自动重置统计
- **邮件通知**：通过 Resend 发送告警邮件
- **状态持久化**：自动保存状态到 `.data/state.json` 并提交到仓库
- **GitHub Actions 部署**：完全托管，无需服务器

### ? 技术实现

- **运行时**：Node.js 20+
- **时区处理**：Luxon 3.4.4
- **邮件服务**：Resend 3.2.0
- **数据源**：币安公共 API（无需密钥）

### ? 文档

- `README.md` - 项目介绍和功能说明
- `QUICKSTART.md` - 5 分钟快速部署指南
- `DEPLOYMENT.md` - 详细部署步骤和配置说明
- `ARCHITECTURE.md` - 技术架构和实现细节
- `FAQ.md` - 常见问题解答

### ? 配置项

- `SYMBOLS` - 监控的交易对（默认：BTCUSDT,ETHUSDT,BNBUSDT）
- `TIMEZONE` - 时区（默认：Asia/Shanghai）
- `INITIAL_THRESHOLD` - 首次告警阈值（默认：6%）
- `THRESHOLD_STEP` - 阈值递增步长（默认：2%）
- Cron 表达式 - 运行频率（默认：每 5 分钟）

### ? 测试工具

- `test-config.js` - 配置验证脚本
  - 检查环境变量
  - 测试 Binance API 连通性
  - 测试 Resend 邮件发送

### ? 支持的币种

默认监控 3 个主流币种，可自定义添加任意币安现货交易对：
- BTCUSDT（比特币）
- ETHUSDT（以太坊）
- BNBUSDT（币安币）

### ? 成本

- **完全免费**（使用公开仓库）
  - GitHub Actions：无限免费
  - Binance API：免费公共接口
  - Resend：100 封/月免费

### ? 安全性

- 无需交易所账号或 API 密钥
- 仅读取公共行情数据
- 无交易权限
- 敏感配置存储在 GitHub Secrets

### ? 性能

- API 调用：< 1 请求/分钟（远低于限制）
- Actions 运行时间：~30 秒/次
- 私有仓库每月消耗：~150 分钟

### ? 支持的平台

- **部署平台**：GitHub Actions
- **邮件服务**：Resend
- **数据源**：Binance（全球可用）

### ? 开源协议

MIT License - 自由使用、修改和分发

---

## [未来计划] - Roadmap

### ? 计划中的功能

- [ ] 支持更多通知渠道（Telegram、Discord、企业微信）
- [ ] 支持其他交易所（OKX、Bybit、Gate.io）
- [ ] 历史数据记录和图表展示
- [ ] Web 仪表盘（查看实时状态和历史告警）
- [ ] 自定义告警规则（如仅上涨/下跌时告警）
- [ ] 多时区支持（同时监控多个时区）
- [ ] 高级统计（波动率、振幅等）
- [ ] 移动端推送通知

### ? 已知问题

- 私有仓库会超出免费 Actions 配额（建议使用公开仓库）
- 邮件发送失败时不会重试（状态已推进，可能丢失告警）

### ? 欢迎贡献

欢迎提交 Issue 和 Pull Request！

---

## 版本说明

### 版本号规则

- **主版本号 (Major)**：不兼容的 API 变更
- **次版本号 (Minor)**：向下兼容的功能新增
- **修订号 (Patch)**：向下兼容的问题修复

### 标签说明

- ? 首次发布
- ? 新增功能
- ? Bug 修复
- ? 文档更新
- ? 配置变更
- ? 性能优化
- ? 安全更新
- ? 破坏性变更
- ?? 废弃功能

---

## 如何升级

当有新版本发布时：

### Fork 的仓库

1. 在你的仓库页面，查看是否有 "This branch is behind" 提示
2. 点击 **Sync fork** → **Update branch**

### 本地克隆的仓库

```bash
git remote add upstream https://github.com/ORIGINAL_REPO_URL
git fetch upstream
git merge upstream/main
git push origin main
```

### 注意事项

- 升级前查看 CHANGELOG 了解变更
- 如有破坏性变更（?），请仔细阅读升级说明
- 建议先在测试环境验证
- 升级后重新检查配置是否正确

---

## 支持

- ? 查看文档：[README.md](./README.md)
- ? 常见问题：[FAQ.md](./FAQ.md)
- ? 报告问题：GitHub Issues
- ? 讨论交流：GitHub Discussions

感谢使用！?

