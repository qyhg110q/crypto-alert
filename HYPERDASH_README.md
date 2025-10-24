# Hyperdash 仓位监控功能

## 功能说明

监听 Hyperliquid 上指定地址的仓位变化（clearinghouseState），并通过邮件通知：
- **新开仓位**：检测到新的持仓 coin
- **平仓**：检测到 coin 持仓消失
- **仓位变化**：检测到 szi（合约张数）或 positionValue（头寸名义）变化

### 默认监听地址
- `0xc2a30212a8ddac9e123944d6e29faddce994e5f2`
- `0xb317d2bc2d3d2df5fa441b5bae0ab9d8b07283ae`

### 监控数据
- **coin**：资产/交易对
- **szi**：合约张数（正数=多仓，负数=空仓）
- **positionValue**：头寸名义价值
- **entryPx**：入场均价
- **unrealizedPnl**：未实现盈亏
- **liquidationPx**：预估强平价
- **leverage**：当前杠杆倍数
- **leverageType**：杠杆类型（cross 全仓 / isolated 逐仓）

### 特性
- ? 自动检测新开仓位
- ? 自动检测平仓
- ? 自动检测仓位变化（加仓/减仓/换仓）
- ? 状态持久化（`.data/hyperdash.json`）
- ? 自动重试（3 次，渐进式延迟）
- ? 按地址独立通知

## 配置

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `HYPERDASH_ADDRESSES` | 监听的地址列表（逗号分隔） | 内置两个地址 |
| `RESEND_API_KEY` | Resend 邮件 API 密钥 | **必需** |
| `EMAIL_TO` | 接收邮件地址 | **必需** |
| `EMAIL_FROM` | 发送邮件地址 | **必需** |

### API 说明

使用 Hyperliquid 官方 API：
- **端点**：`https://api.hyperliquid.xyz/info`
- **方法**：POST
- **请求体**：`{ "type": "clearinghouseState", "user": "0x地址" }`
- **无需 API Key**
- **限流**：宽松

## 使用方法

### 1. 本地测试

测试能否获取仓位数据：

```bash
node test-hyperdash.js
```

**预期输出（有持仓时）：**
```
Address: 0xc2a30212a8ddac9e123944d6e29faddce994e5f2
------------------------------------------------------------
  Found 2 position(s):

  BTC:
    Direction: LONG
    Size: 0.5000 contracts
    Position Value: $54100.00
    Entry Price: $108200.0000
    Unrealized PnL: $150.00
    Liquidation Price: $102000.0000
    Leverage: 2.0x (cross)

  ETH:
    Direction: SHORT
    Size: 5.0000 contracts
    Position Value: $19100.00
    Entry Price: $3820.0000
    Unrealized PnL: -$50.00
    Leverage: 3.0x (isolated)
```

**预期输出（无持仓时）：**
```
Address: 0xc2a30212a8ddac9e123944d6e29faddce994e5f2
------------------------------------------------------------
  No open positions
```

### 2. 完整流程测试

运行主程序（包含价格监控和仓位监控）：

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

仓位监控已集成到主 workflow（`.github/workflows/volatility-alert.yml`）：
- 每 5 分钟自动运行
- 拉取仓位 → 比对变化 → 发送邮件 → 更新状态
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

### 新开仓位
```
Subject: [Hyperdash Position] 2 opened - 0xc2a3...e5f2

NEW POSITIONS OPENED:
------------------------------------------------------------
  BTC
    Size: LONG 0.5000 contracts
    Position Value: $54100.00
    Entry Price: $108200.0000
    Unrealized PnL: $0.00
    Liquidation Price: $102000.0000
    Leverage: 2.0x (cross)

  ETH
    Size: SHORT 5.0000 contracts
    Position Value: $19100.00
    Entry Price: $3820.0000
    Unrealized PnL: $0.00
    Leverage: 3.0x (isolated)
```

### 平仓
```
Subject: [Hyperdash Position] 1 closed - 0xc2a3...e5f2

POSITIONS CLOSED:
------------------------------------------------------------
  BTC
    Closed Size: LONG 0.5000 contracts
    Last Value: $54250.00
    Entry Price: $108200.0000
    Final PnL: $150.00
```

### 仓位变化
```
Subject: [Hyperdash Position] 1 changed - 0xc2a3...e5f2

POSITIONS CHANGED:
------------------------------------------------------------
  BTC
    Size: LONG 0.5000 -> LONG 1.0000 (+0.5000)
    Value: $54100.00 -> $108200.00 (+$54100.00)
    Entry Px: $108200.0000 -> $108200.0000
    Current PnL: $300.00
    Liquidation Px: $102000.0000
    Leverage: 2.0x (cross)
```

## 状态管理

### 状态文件位置
`.data/hyperdash.json`

### 状态格式
```json
{
  "addresses": {
    "0xc2a30212a8ddac9e123944d6e29faddce994e5f2": {
      "positions": {
        "BTC": { "szi": 180.3, "positionValue": 20057568.90, ... },
        "ETH": { "szi": 33270.78, "positionValue": 131712368.22, ... }
      },
      "lastNotifiedPositions": {
        "BTC": { "szi": 100.0, "positionValue": 11000000.00, ... },
        "ETH": { "szi": 30000.0, "positionValue": 115000000.00, ... }
      }
    }
  }
}
```

**说明**：
- `positions`：当前实际仓位（每次运行更新）
- `lastNotifiedPositions`：上一次通知时的仓位（仅通知后更新，作为下次比对基准）

### 变化检测机制

**重要**：系统以**上一次通知时的仓位**作为基准进行比对，而不是每次运行的仓位。

1. **新开仓**：当前仓位中出现新的 coin
   - **无数量限制**：任何新开仓都会通知
   - 示例：BTC 从 0 → 10 合约 → ? 通知，基准设为 10
   
2. **平仓**：上次通知基准中的 coin 消失
   - **无数量限制**：任何平仓都会通知
   - 示例：BTC 从基准 300 → 0 合约 → ? 通知
   
3. **仓位变化**（加仓/减仓）：
   - **ETH 阈值：3000 个合约**
   - **BTC 阈值：100 个合约**
   - **其他币种：1% 仓位变化**
   - 按合约数量（szi）与**上次通知基准**比对，不受币价波动影响
   
   **示例 1：BTC 逐步加仓**
   - 首次建仓：0 → 10 合约 → ? 通知，**基准 = 10**
   - 加仓：10 → 50 → 90（与基准 10 比，变化 80 < 100）→ ? 不通知，基准仍为 10
   - 继续加仓：90 → 130（与基准 10 比，变化 120 > 100）→ ? 通知，**基准 = 130**
   - 小幅调整：130 → 150（与基准 130 比，变化 20 < 100）→ ? 不通知
   - 继续加仓：150 → 250（与基准 130 比，变化 120 > 100）→ ? 通知，**基准 = 250**
   
   **示例 2：ETH 双向触发**
   - 初始基准：300 ETH 合约
   - 加仓：300 → 3500（变化 3200 > 3000）→ ? 通知，**基准 = 3500**
   - 下次触发条件：
     - 加仓到 > 6500（+3000）→ 通知
     - 减仓到 < 500（-3000）→ 通知

### 重置状态

如需重新初始化，删除状态文件：
```bash
rm .data/hyperdash.json
```

下次运行时会记录当前所有仓位作为初始状态，不会发送通知。

## 故障排查

### 问题 1：获取不到数据

**检查：**
```bash
# 测试 Hyperliquid API
curl -X POST https://api.hyperliquid.xyz/info \
  -H "Content-Type: application/json" \
  -d '{"type":"clearinghouseState","user":"0xc2a30212a8ddac9e123944d6e29faddce994e5f2"}'
```

**可能原因：**
- 地址格式错误（需要 `0x` 前缀）
- 该地址无持仓（正常情况）
- API 限流（罕见）

### 问题 2：误报仓位变化

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

```javascript
POST https://api.hyperliquid.xyz/info
Content-Type: application/json

{
  "type": "clearinghouseState",
  "user": "0xc2a30212a8ddac9e123944d6e29faddce994e5f2"
}
```

### API 响应结构

```javascript
{
  "assetPositions": [
    {
      "position": {
        "coin": "BTC",
        "szi": "0.5",
        "positionValue": "54100.00",
        "entryPx": "108200.0000",
        "unrealizedPnl": "150.00",
        "liquidationPx": "102000.0000",
        "leverage": {
          "value": "2.0",
          "type": "cross"
        }
      },
      "type": "oneWay"
    }
  ],
  "marginSummary": { ... },
  ...
}
```

### 数据归一化

代码会自动归一化为统一格式：

```javascript
{
  coin: string,           // 资产名称
  szi: number,            // 合约张数（正=多，负=空）
  positionValue: number,  // 头寸名义价值
  entryPx: number,        // 入场均价
  unrealizedPnl: number,  // 未实现盈亏
  liquidationPx: number|null, // 强平价（可能为 null）
  leverage: number,       // 杠杆倍数
  leverageType: string    // 'cross' 或 'isolated'
}
```

### 重试策略

- **超时时间**：30 秒
- **重试次数**：3 次
- **重试延迟**：2秒、4秒、6秒（渐进式）

### 性能考虑

- 每次拉取完整仓位快照
- 请求间隔：单地址拉取完后立即处理下一个
- 状态文件：存储所有 coin 的完整快照
- 邮件：每个地址的变化独立发送邮件

## 常见问题

### Q: 能监听其他 DEX 吗？
A: 当前仅支持 Hyperliquid。如需其他 DEX，需要修改 `src/hyperdash.js` 中的 API 端点。

### Q: 为什么首次运行不通知？
A: 首次运行会记录当前仓位作为基准状态，从第二次运行开始才检测变化。

### Q: 最多能监听多少个地址？
A: 理论上无限制，但建议不超过 10 个（避免 API 限流）。

### Q: 如何调整变化通知阈值？
A: 代码已内置过滤（按合约数量判断）：
- **新开仓/平仓**：无数量限制，总是通知
- **仓位变化**：
  - ETH：超过 **3000 个合约**
  - BTC：超过 **100 个合约**
  - 其他币种：超过 **1% 仓位**
- 可在 `src/hyperdash_state.js` 中修改 `THRESHOLDS` 对象

### Q: 能否只监听特定币种？
A: 需要修改代码。在 `src/index.js` 的 `monitorHyperdashPositions` 函数中添加：
```javascript
const currentPositions = await getClearinghouseState(addr);
const filteredPositions = currentPositions.filter(p => 
  p.coin === 'BTC' || p.coin === 'ETH' // 只监听 BTC 和 ETH
);
```

### Q: 能否按盈亏阈值报警？
A: 需要修改代码。在 `src/hyperdash_state.js` 的 `comparePositions` 函数中添加盈亏阈值检查。

### Q: 为什么有时候 liquidationPx 是 null？
A: 全仓模式（cross）或低杠杆时，强平价可能非常远或无法计算，API 返回 null。

## 相关文件

- `src/hyperdash.js` - API 客户端（getClearinghouseState）
- `src/hyperdash_state.js` - 状态管理（comparePositions, updateAddressPositions）
- `src/notifier.js` - 邮件通知（sendPositionChangeEmail）
- `src/index.js` - 主流程集成（monitorHyperdashPositions）
- `test-hyperdash.js` - 本地测试脚本
- `crypto.plan.md` - 技术设计文档

## 更新日志

- **2025-10-23**：V2.0 仓位监控版本
  - **重大变更**：从成交监听改为仓位监控
  - 监控 clearinghouseState API
  - 检测新开仓、平仓、仓位变化
  - 显示完整仓位信息（szi, positionValue, entryPx, PnL, 强平价, 杠杆）
  - 优化变化检测算法
