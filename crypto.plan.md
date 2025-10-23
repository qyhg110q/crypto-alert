# 加密货币波动告警与 Hyperdash 成交监听（GitHub Actions + Resend）

## 范围与目标

- 价格波动告警：监控 `BTCUSDT, ETHUSDT, BNBUSDT` 的 24 小时涨跌幅（CoinGecko）。
- 阈值从 6% 起，之后每次在上一次基础上 +2%（8%、10%、12% ...），每日 Asia/Shanghai 00:00 重置。
- 成交监听：监听 Hyperdash/Hyperliquid 上指定地址的用户成交（userFills），并通过邮件通知。
  - 目标地址：
    - `0xc2a30212a8ddac9e123944d6e29faddce994e5f2`
    - `0xb317d2bc2d3d2df5fa441b5bae0ab9d8b07283ae`
  - 每次运行抓取最新成交，与本地状态去重，仅对新增成交发送邮件。

## 技术栈

- Node.js 20（内置 fetch）。
- Resend 官方 Node SDK（邮件）。
- Luxon 处理时区（Asia/Shanghai）。
- CoinGecko 市场数据（24h 涨跌与价格）。
- Hyperdash/Hyperliquid 成交数据：
  - 首选 `https://api.hyperliquid.xyz/info`（POST，type=userFills）。
  - 备选 `https://api.hypereth.io/v2/hyperliquid/getUserFills`（如配置了 `HYPERETH_API_KEY`）。

## 文件结构

- `src/index.js`：主流程（价格监控 + 成交监听）。
- `src/coingecko.js`：CoinGecko API 客户端。
- `src/hyperdash.js`：Hyperdash/Hyperliquid userFills 客户端（重试、超时）。
- `src/hyperdash_state.js`：`.data/hyperdash.json` 状态读写（每地址 `lastTimestamp` 与最近 `seenIds`）。
- `src/notifier.js`：
  - `sendNotification()`：价格阈值告警。
  - `sendHyperdashFillsEmail()`：成交邮件通知（按地址汇总）。

## Hyperdash 成交监听流程

1. 从环境读取或使用默认地址列表：
   - `HYPERDASH_ADDRESSES`（CSV），默认为上述两个地址。
2. 读取 `hyperdash.json` 状态；若不存在则初始化（每地址 `lastTimestamp=0`、`seenIds=[]`）。
3. 逐地址调用 userFills 接口（优先 hyperliquid `info`，可选 hypereth）：
   - 请求近 N 条（默认 100）。
   - 过滤条件：`timestamp > lastTimestamp` 或 `fillId` 未出现。
4. 汇总新增成交，按地址分组构建邮件正文，发送一次邮件（若有新增）。
5. 更新状态：
   - `lastTimestamp` 置为该地址最新成交时间戳。
   - `seenIds` 合并去重并截断保留近 200 条。
6. 将 `hyperdash.json` 写回 `.data/` 并由现有工作流提交。

## 失败与边界处理

- 接口失败：重试 3 次，指数退避（2s/4s/6s）。
- 响应为空或解析失败：跳过该地址，记录日志。
- 邮件发送失败：打印错误但不回滚状态（下次仍会再次尝试发送新增部分）。

## 环境变量

- 价格告警：`RESEND_API_KEY`, `EMAIL_TO`, `EMAIL_FROM`, `SYMBOLS`。
- 成交监听：
  - `HYPERDASH_ADDRESSES`（可选，CSV），默认内置两个地址。
  - `HYPERDASH_PROVIDER`（可选，`hyperliquid`|`hypereth`，默认 `hyperliquid`）。
  - `HYPERETH_API_KEY`（可选，仅当 provider=hypereth 时需要）。

## 待办与里程碑

1) 新增 `src/hyperdash.js` 客户端（进行中）
2) 新增 `src/hyperdash_state.js` 持久化
3) 扩展 `src/notifier.js`，新增成交邮件
4) 集成至 `src/index.js` 主流程
5) 增加 `test-hyperdash.js` 脚本与 README 文档


