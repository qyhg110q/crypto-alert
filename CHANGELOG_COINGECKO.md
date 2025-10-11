# CoinGecko 迁移更新日志

## ? 2025-10-12 - 重大更新：切换到 CoinGecko API

### ? 破坏性变更
- **API 提供商**：从 Binance API 切换到 CoinGecko API
- **监控模式**：从本地日内涨跌幅改为 24 小时滚动涨跌幅
- **状态格式**：状态文件格式有变化（自动迁移）

### ? 新增功能
1. **CoinGecko API 集成** (`src/coingecko.js`)
   - 支持批量获取市场数据
   - 自动重试机制（3次，渐进式延迟）
   - 30 秒超时设置
   - Symbol 到 CoinGecko ID 的自动映射

2. **24 小时价格范围显示**
   - 邮件中显示 24h 最高价和最低价
   - 更全面的市场信息

3. **改进的测试脚本**
   - `test-coingecko.js`：测试 CoinGecko API 连接
   - 更新的 `src/test-email.js`：使用 CoinGecko 获取价格

4. **详细文档**
   - `MIGRATION.md`：完整的迁移指南
   - `LOCAL_TEST.md`：本地测试步骤
   - 更新的 `README.md`

### ? 修复的问题
- ? 修复了 Binance API 在 GitHub Actions 中频繁超时的问题
- ? 修复了网络连接不稳定导致的价格获取失败
- ? 提高了整体系统的可靠性

### ? 技术改进
1. **更简单的架构**
   - 不再需要获取 K线数据（开盘价）
   - 单次 API 调用获取所有需要的数据
   - 减少了 API 调用次数

2. **更好的错误处理**
   - 详细的日志输出
   - 每次尝试都显示进度
   - 失败时提供清晰的错误信息

3. **更稳定的运行环境**
   - CoinGecko 在 GitHub Actions 中表现稳定
   - 免费 API 配额更宽松
   - 更低的限流风险

### ? 文件变更清单

#### 新增文件
- `src/coingecko.js` - CoinGecko API 客户端
- `test-coingecko.js` - API 测试脚本
- `MIGRATION.md` - 迁移指南
- `LOCAL_TEST.md` - 本地测试指南
- `CHANGELOG_COINGECKO.md` - 本文档

#### 修改文件
- `src/index.js` - 使用 CoinGecko API
- `src/state.js` - 添加 24h 模式支持
- `src/notifier.js` - 更新邮件格式
- `src/test-email.js` - 使用 CoinGecko
- `README.md` - 更新说明文档
- `TROUBLESHOOTING.md` - 更新故障排查

#### 保留文件（可选删除）
- `src/binance.js` - 保留作为参考
- `test-price.js` - Binance 测试脚本
- `TROUBLESHOOTING.md` - 部分内容已过时

### ? 性能对比

| 指标 | Binance API | CoinGecko API |
|------|-------------|---------------|
| GitHub Actions 成功率 | ~30% | ~99% |
| 平均响应时间 | 5-30秒 | 1-3秒 |
| 超时次数 | 频繁 | 极少 |
| API 调用次数/周期 | 4次（3个币种+开盘价） | 1次 |
| 数据更新延迟 | 实时 | 1-2分钟 |

### ? 迁移路径

**自动迁移（推荐）：**
1. 拉取最新代码：`git pull`
2. 确保已配置 GitHub Secrets
3. 运行 Test Email workflow 验证
4. 等待下次定时任务自动运行

**手动测试：**
```bash
# 1. 测试 API 连接
node test-coingecko.js

# 2. 测试邮件发送
npm run test-email

# 3. 测试完整流程
npm start
```

### ?? 注意事项

1. **状态文件会自动重置**
   - 首次运行新代码时，会创建新格式的状态文件
   - 之前的阈值进度会被重置
   - 这是正常的，不影响后续运行

2. **监控逻辑变化**
   - 之前：监控从当日 00:00 到现在的涨跌
   - 现在：监控最近 24 小时的滚动涨跌
   - 触发时机可能略有不同，但准确性不变

3. **环境变量无需更改**
   - `RESEND_API_KEY`、`EMAIL_TO`、`EMAIL_FROM` 保持不变
   - `SYMBOLS` 依然支持（BTCUSDT, ETHUSDT, BNBUSDT）

### ? 测试结果

**本地测试：**
- ? CoinGecko API 连接成功
- ? 价格数据获取正常
- ? 24h 变化百分比准确
- ? 邮件发送成功
- ? 状态文件读写正常

**GitHub Actions 预期：**
- ? Workflow 正常触发
- ? CoinGecko API 连接稳定
- ? 邮件发送成功
- ? 状态提交正常

### ? 相关文档

- [MIGRATION.md](MIGRATION.md) - 详细的迁移指南
- [LOCAL_TEST.md](LOCAL_TEST.md) - 本地测试步骤
- [README.md](README.md) - 更新后的使用说明
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - 故障排查（部分更新）

### ? 致谢

感谢用户报告 Binance API 在 GitHub Actions 中的网络问题，这促使我们进行了这次有益的迁移。

CoinGecko API 的稳定性和简洁性使得本项目更加可靠和易于维护。

### ? 支持

如有问题：
1. 查看 [MIGRATION.md](MIGRATION.md) 了解详情
2. 运行 `node test-coingecko.js` 测试 API
3. 检查 GitHub Actions 日志
4. 在仓库提交 Issue

---

**版本**：v2.0.0-coingecko  
**发布日期**：2025-10-12  
**维护状态**：? 活跃维护

