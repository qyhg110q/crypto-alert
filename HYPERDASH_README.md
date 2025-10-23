# Hyperdash 成交监听功能

## 功能说明

监听 Hyperliquid 上指定地址的用户成交（userFills），并通过邮件通知新增成交记录。

### 默认监听地址
- `0xc2a30212a8ddac9e123944d6e29faddce994e5f2`
- `0xb317d2bc2d3d2df5fa441b5bae0ab9d8b07283ae`

### 特性
- ? 自动去重（基于时间戳与成交 ID）
- ? 状态持久化（`.data/hyperdash.json`）
- ? 自动重试（3 次，渐进式延迟）
- ? 按地址分组的邮件通知
- ? 支持 Hyperliquid 与 Hypereth 两种 API

## 配置

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `HYPERDASH_ADDRESSES` | 监听的地址列表（逗号分隔） | 内置两个地址 |
| `HYPERDASH_PROVIDER` | API 提供商：`hyperliquid` 或 `hypereth` | `hyperliquid` |
| `HYPERETH_API_KEY` | Hypereth API 密钥（仅 provider=hypereth 时需要） | - |
| `RESEND_API_KEY` | Resend 邮件 API 密钥 | **必需** |
| `EMAIL_TO` | 接收邮件地址 | **必需** |
| `EMAIL_FROM` | 发送邮件地址 | **必需** |

### API 提供商对比

#### Hyperliquid（默认，推荐）
- **端点**：`https://api.hyperliquid.xyz/info`
- **方法**：POST
- **无需 API Key**
- **限流**：宽松

#### Hypereth
- **端点**：`https://api.hypereth.io/v2/hyperliquid/getUserFills`
- **方法**：GET
- **需要 API Key**（在 headers 中配置 `X-API-KEY`）
- **限流**：根据套餐

## 使用方法

### 1. 本地测试

测试能否获取历史成交数据：

```bash
node test-hyperdash.js
```

**预期输出：**
```
Address 0xc2a30212a8ddac9e123944d6e29faddce994e5f2 lastTimestamp=0
Fetched 50 fills
New fills: 50
2025-10-23T01:28:55.066Z BTC B px=108150 sz=0.33897
2025-10-23T01:28:55.066Z BTC B px=108150 sz=0.0001
...
```

### 2. 完整流程测试

运行主程序（包含价格监控和成交监听）：

```bash
# Windows PowerShell
$env:RESEND_API_KEY="re_your_key"
$env:EMAIL_TO="your@email.com"
$env:EMAIL_FROM="noreply@yourdomain.com"
npm start

# Linux/Mac
RESEND_API_KEY=re_your_key \
EMAIL_TO=your@email.com \
EMAIL_FROM=noreply@yourdomain.com \
npm start
```

### 3. GitHub Actions 自动运行

成交监听已集成到主 workflow（`.github/workflows/volatility-alert.yml`）：
- 每 5 分钟自动运行
- 拉取新成交 → 去重 → 发送邮件 → 更新状态
- 状态文件自动提交回仓库

### 4. 自定义监听地址

**方法 1：环境变量（推荐）**

```bash
# Windows PowerShell
$env:HYPERDASH_ADDRESSES="0x地址1,0x地址2,0x地址3"
npm start

# GitHub Actions Secrets
HYPERDASH_ADDRESSES=0x地址1,0x地址2,0x地址3
```

**方法 2：修改代码**

编辑 `src/index.js`，修改默认值：
```javascript
const addrsEnv = process.env.HYPERDASH_ADDRESSES || '你的地址1,你的地址2';
```

## 邮件格式

成交邮件示例：

```
Subject: [Hyperdash Fills] 15 new fills across 2 address(es)

Hyperdash User Fills
============================================================

Address: 0xc2a30212a8ddac9e123944d6e29faddce994e5f2
------------------------------------------------------------
  2025/10/23 09:28:55  BTC       BUY   px=$108150.0000  sz=0.33897
  2025/10/23 09:28:54  BTC       BUY   px=$108150.0000  sz=1.0
  2025/10/23 09:28:53  ETH       SELL  px=$3819.6000   sz=0.5

Address: 0xb317d2bc2d3d2df5fa441b5bae0ab9d8b07283ae
------------------------------------------------------------
  2025/10/23 09:12:39  BTC       BUY   px=$108250.0000  sz=0.15409
  ...

============================================================

Timestamp: 2025/10/23 09:30:00 (Asia/Shanghai)

This is an automated notification for Hyperdash user fills.
```

## 状态管理

### 状态文件位置
`.data/hyperdash.json`

### 状态格式
```json
{
  "addresses": {
    "0xc2a30212a8ddac9e123944d6e29faddce994e5f2": {
      "lastTimestamp": 1729653535066,
      "seenIds": [
        "fill_abc123...",
        "fill_def456..."
      ]
    },
    "0xb317d2bc2d3d2df5fa441b5bae0ab9d8b07283ae": {
      "lastTimestamp": 1729650759997,
      "seenIds": [
        "fill_xyz789..."
      ]
    }
  }
}
```

### 去重机制
1. **时间戳过滤**：只拉取 `timestamp > lastTimestamp` 的成交
2. **ID 去重**：检查 `fillId` 是否在 `seenIds` 中
3. **ID 缓存**：保留最近 200 个 `fillId`（避免状态文件过大）

### 重置状态

如需重新获取所有历史成交，删除状态文件：
```bash
rm .data/hyperdash.json
```

## 故障排查

### 问题 1：获取不到数据

**检查：**
```bash
# 测试 Hyperliquid API
curl -X POST https://api.hyperliquid.xyz/info \
  -H "Content-Type: application/json" \
  -d '{"type":"userFills","user":"0xc2a30212a8ddac9e123944d6e29faddce994e5f2","n":10}'
```

**可能原因：**
- 地址格式错误（需要 `0x` 前缀）
- 该地址无成交记录
- API 限流

### 问题 2：重复通知

**检查：**
- `.data/hyperdash.json` 是否被正确更新
- GitHub Actions 是否有提交冲突

**解决：**
```bash
# 查看状态文件
cat .data/hyperdash.json

# 手动触发一次更新
node test-hyperdash.js
```

### 问题 3：邮件未收到

**检查：**
1. `RESEND_API_KEY` 是否正确
2. `EMAIL_FROM` 域名是否在 Resend 中验证
3. 垃圾邮件文件夹
4. GitHub Actions 日志中是否有错误

### 查看日志

**GitHub Actions：**
1. 访问仓库 → Actions
2. 点击最近的 workflow run
3. 展开 "Run volatility alert"
4. 搜索 "Hyperdash" 查看相关日志

**本地：**
```bash
node test-hyperdash.js 2>&1 | tee hyperdash.log
```

## 技术细节

### API 请求示例

**Hyperliquid：**
```javascript
POST https://api.hyperliquid.xyz/info
Content-Type: application/json

{
  "type": "userFills",
  "user": "0xc2a30212a8ddac9e123944d6e29faddce994e5f2",
  "n": 100
}
```

**Hypereth：**
```javascript
GET https://api.hypereth.io/v2/hyperliquid/getUserFills?address=0xc2a30212a8ddac9e123944d6e29faddce994e5f2&limit=100
X-API-KEY: your_key_here
```

### 数据归一化

不同 API 返回的字段名不同，代码会自动归一化为统一格式：

```javascript
{
  fillId: string,     // 成交 ID
  symbol: string,     // 交易对（如 "BTC"）
  side: string,       // 方向（"buy" 或 "sell"）
  price: number,      // 成交价格
  size: number,       // 成交数量
  quote: number,      // 成交金额
  fee: number,        // 手续费
  feeAsset: string,   // 手续费币种
  isMaker: boolean,   // 是否 maker
  timestamp: number   // 时间戳（毫秒）
}
```

### 重试策略

- **超时时间**：30 秒
- **重试次数**：3 次
- **重试延迟**：2秒、4秒、6秒（渐进式）

### 性能考虑

- 每次最多拉取 100 条成交
- 请求间隔：单地址拉取完后立即处理下一个
- 状态文件：仅保留最近 200 个 fillId
- 邮件：所有地址的新成交汇总为一封邮件

## 常见问题

### Q: 能监听其他链吗？
A: 当前仅支持 Hyperliquid。如需其他链，需要修改 `src/hyperdash.js` 中的 API 端点。

### Q: 能监听所有交易对吗？
A: 是的，API 返回该地址的所有成交，自动包含所有交易对。

### Q: 最多能监听多少个地址？
A: 理论上无限制，但建议不超过 10 个（避免 API 限流和邮件过长）。

### Q: 能否只监听特定交易对？
A: 需要修改代码过滤。在 `src/index.js` 的 `monitorHyperdashFills` 函数中添加：
```javascript
const newOnes = fills.filter(f => 
  (f.timestamp > (aState.lastTimestamp || 0)) && 
  (!aState.seenIds || !aState.seenIds.includes(f.fillId)) &&
  (f.symbol === 'BTC' || f.symbol === 'ETH') // 只监听 BTC 和 ETH
);
```

### Q: 能否按成交金额过滤？
A: 同上，在过滤条件中添加：
```javascript
&& (f.quote >= 1000) // 只通知金额 >= 1000 的成交
```

## 相关文件

- `src/hyperdash.js` - API 客户端
- `src/hyperdash_state.js` - 状态管理
- `src/notifier.js` - 邮件通知（`sendHyperdashFillsEmail`）
- `src/index.js` - 主流程集成（`monitorHyperdashFills`）
- `test-hyperdash.js` - 本地测试脚本
- `crypto.plan.md` - 技术设计文档

## 更新日志

- **2025-10-23**：初始版本
  - 支持 Hyperliquid 和 Hypereth
  - 自动去重与状态持久化
  - 按地址分组的邮件通知
  - 集成到主 workflow

