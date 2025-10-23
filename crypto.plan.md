# 加密货币波动告警与 Hyperdash 仓位监控（GitHub Actions + Resend）

## 范围与目标

- **价格波动告警**：监控 `BTCUSDT, ETHUSDT, BNBUSDT` 的 24 小时涨跌幅（CoinGecko）。
- 阈值从 6% 起，之后每次在上一次基础上 +2%（8%、10%、12% ...），每日 Asia/Shanghai 00:00 重置。
- **仓位监控**：监听 Hyperdash/Hyperliquid 上指定地址的仓位变化（clearinghouseState），并通过邮件通知。
  - 目标地址：
    - `0xc2a30212a8ddac9e123944d6e29faddce994e5f2`
    - `0xb317d2bc2d3d2df5fa441b5bae0ab9d8b07283ae`
  - 监控内容：新开仓、平仓、仓位变化（szi/positionValue）

## 技术栈

- Node.js 20（内置 fetch）。
- Resend 官方 Node SDK（邮件）。
- Luxon 处理时区（Asia/Shanghai）。
- CoinGecko 市场数据（24h 涨跌与价格）。
- Hyperliquid clearinghouseState API：
  - 端点：`https://api.hyperliquid.xyz/info`（POST，type=clearinghouseState）
  - 响应：`assetPositions[].position` 包含 coin, szi, positionValue, entryPx, unrealizedPnl, liquidationPx, leverage

## 文件结构

- `src/index.js`：主流程（价格监控 + 仓位监控）。
- `src/coingecko.js`：CoinGecko API 客户端。
- `src/hyperdash.js`：Hyperliquid clearinghouseState 客户端（重试、超时、归一化）。
- `src/hyperdash_state.js`：`.data/hyperdash.json` 状态读写（每地址每币种的仓位快照）。
- `src/notifier.js`：
  - `sendNotification()`：价格阈值告警。
  - `sendPositionChangeEmail()`：仓位变化邮件通知（按地址独立发送）。

## Hyperdash 仓位监控流程

1. 从环境读取或使用默认地址列表：
   - `HYPERDASH_ADDRESSES`（CSV），默认为上述两个地址。
2. 读取 `hyperdash.json` 状态；若不存在则初始化（每地址 `positions={}`）。
3. 逐地址调用 clearinghouseState 接口：
   - 请求体：`{ type: 'clearinghouseState', user: '0x地址' }`
   - 解析 `assetPositions[].position` 提取仓位数据。
4. 比对仓位变化：
   - **新开仓**：当前快照中出现新的 coin
   - **平仓**：之前快照中的 coin 消失
   - **仓位变化**：szi 或 positionValue 变化
5. 若有变化，发送邮件通知（按地址独立发送）。
6. 更新状态：
   - 将当前仓位快照写入 `positions[coin] = { szi, positionValue, entryPx, ... }`
7. 将 `hyperdash.json` 写回 `.data/` 并由现有工作流提交。

## 监控数据

- **coin**: 资产/交易对
- **szi**: 合约张数（正=多仓，负=空仓）
- **positionValue**: 头寸名义价值
- **entryPx**: 入场均价
- **unrealizedPnl**: 未实现盈亏
- **liquidationPx**: 预估强平价
- **leverage**: { value: 杠杆倍数, type: "cross" | "isolated" }

## 变化检测逻辑

- **新开仓**: 之前无该 coin，现在有
- **平仓**: 之前有该 coin，现在无
- **仓位变化**:
  - `szi` 变化
  - `positionValue` 变化 > $0.01
  - `entryPx` 变化 > 0.01%

## 状态文件格式

```json
{
  "addresses": {
    "0xADDR": {
      "positions": {
        "BTC": {
          "szi": 0.5,
          "positionValue": 54100.00,
          "entryPx": 108200.0000,
          "unrealizedPnl": 150.00,
          "liquidationPx": 102000.0000,
          "leverage": 2.0,
          "leverageType": "cross"
        }
      }
    }
  }
}
```

## 失败与边界处理

- 接口失败：重试 3 次，指数退避（2s/4s/6s）。
- 响应为空或无 assetPositions：跳过该地址，记录日志。
- 邮件发送失败：打印错误，但仍更新状态避免误报。
- 首次运行：记录当前仓位作为基准，不发送通知。

## 环境变量

- 价格告警：`RESEND_API_KEY`, `EMAIL_TO`, `EMAIL_FROM`, `SYMBOLS`。
- 仓位监控：
  - `HYPERDASH_ADDRESSES`（可选，CSV），默认内置两个地址。

## 待办与里程碑

- [x] 新增 `src/hyperdash.js` 客户端（getClearinghouseState）
- [x] 新增 `src/hyperdash_state.js` 持久化（comparePositions, updateAddressPositions）
- [x] 扩展 `src/notifier.js`，新增仓位变化邮件（sendPositionChangeEmail）
- [x] 集成至 `src/index.js` 主流程（monitorHyperdashPositions）
- [x] 增加 `test-hyperdash.js` 脚本与 HYPERDASH_README.md 文档
- [x] 本地测试验证（能够获取仓位数据）
