# 项目架构说明

本文档详细说明了加密货币日内波动告警服务的技术架构和实现细节。

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Actions                         │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Cron Trigger (每 5 分钟)                          │     │
│  └────────────────┬───────────────────────────────────┘     │
│                   │                                          │
│  ┌────────────────▼───────────────────────────────────┐     │
│  │  Node.js Application                               │     │
│  │  ┌──────────────────────────────────────────────┐  │     │
│  │  │  1. 时区处理 (Luxon)                        │  │     │
│  │  │     - 计算本地日期 (Asia/Shanghai)          │  │     │
│  │  │     - 获取当日 00:00 时间戳                  │  │     │
│  │  └──────────────────────────────────────────────┘  │     │
│  │  ┌──────────────────────────────────────────────┐  │     │
│  │  │  2. 状态管理                                │  │     │
│  │  │     - 读取 .data/state.json                 │  │     │
│  │  │     - 日期检查与重置                        │  │     │
│  │  └──────────────────────────────────────────────┘  │     │
│  │  ┌──────────────────────────────────────────────┐  │     │
│  │  │  3. 数据获取 (Binance API)                  │  │     │
│  │  │     - 获取当日开盘价 (klines)               │  │     │
│  │  │     - 获取实时价格 (ticker/price)           │  │     │
│  │  └──────────────────────────────────────────────┘  │     │
│  │  ┌──────────────────────────────────────────────┐  │     │
│  │  │  4. 波动检测                                │  │     │
│  │  │     - 计算涨跌幅百分比                      │  │     │
│  │  │     - 补齐式阈值判断 (6%, 8%, 10%...)      │  │     │
│  │  └──────────────────────────────────────────────┘  │     │
│  │  ┌──────────────────────────────────────────────┐  │     │
│  │  │  5. 告警通知 (Resend)                       │  │     │
│  │  │     - 组装邮件内容                          │  │     │
│  │  │     - 发送邮件告警                          │  │     │
│  │  └──────────────────────────────────────────────┘  │     │
│  │  ┌──────────────────────────────────────────────┐  │     │
│  │  │  6. 状态持久化                              │  │     │
│  │  │     - 更新 nextThresholdPct                 │  │     │
│  │  │     - 写入 .data/state.json                 │  │     │
│  │  └──────────────────────────────────────────────┘  │     │
│  └────────────────┬───────────────────────────────────┘     │
│                   │                                          │
│  ┌────────────────▼───────────────────────────────────┐     │
│  │  Git Commit & Push                                 │     │
│  │  (状态文件回推到仓库)                              │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘

  ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
  │   Binance   │        │   Resend    │        │   GitHub    │
  │   公共API    │        │   邮件服务   │        │   仓库存储   │
  └─────────────┘        └─────────────┘        └─────────────┘
```

## 模块说明

### 1. 时间处理模块 (`src/time.js`)

**职责：** 处理时区相关的时间计算

**核心功能：**
- `getLocalStartOfDayMs(tz)`: 获取指定时区当日 00:00 的 Unix 时间戳（毫秒）
- `getLocalDateStr(tz)`: 获取指定时区的当前日期字符串 (YYYY-MM-DD)
- `getLocalDateTimeStr(tz)`: 获取指定时区的当前日期时间字符串

**依赖：** Luxon (时区处理库)

**为什么需要：**
- GitHub Actions 运行在 UTC 时区
- 我们需要基于 Asia/Shanghai 时区计算"本地日内"
- 每天 00:00 (Asia/Shanghai) 需要重置统计

### 2. 币安 API 客户端 (`src/binance.js`)

**职责：** 封装币安公共 API 调用

**核心功能：**
- `getCurrentPrice(symbol)`: 获取实时价格
  - API: `/api/v3/ticker/price?symbol=BTCUSDT`
  - 返回：当前价格（数字）或 null（失败）
  
- `getOpenPriceAtLocalMidnight(symbol, startMs)`: 获取本地日内开盘价
  - API: `/api/v3/klines?symbol=BTCUSDT&interval=1m&startTime=...&limit=1`
  - 返回：当日 00:00 后第一根 1m K线的开盘价

**特点：**
- 无需 API 密钥（公共接口）
- 内置错误处理
- 返回 null 而非抛出异常，便于上层处理

### 3. 状态管理模块 (`src/state.js`)

**职责：** 管理持久化状态的读写

**核心功能：**
- `readState()`: 从 `.data/state.json` 读取状态
- `writeState(state)`: 将状态写入 `.data/state.json`
- `createInitialState(date, tz, symbols)`: 创建新的初始状态

**状态结构：**
```json
{
  "date": "2025-10-11",           // 当前统计日期
  "tz": "Asia/Shanghai",           // 时区
  "symbols": {
    "BTCUSDT": {
      "openPrice": 67890.12,       // 当日开盘价
      "nextThresholdPct": 8        // 下一个告警阈值
    },
    ...
  }
}
```

**状态转换逻辑：**
- 当日期变化时，重置所有 symbol 的 `openPrice` 和 `nextThresholdPct`
- 触发告警后，递增对应 symbol 的 `nextThresholdPct`
- 状态文件由 GitHub Actions 自动提交回仓库

### 4. 邮件通知模块 (`src/notifier.js`)

**职责：** 通过 Resend 发送告警邮件

**核心功能：**
- `sendNotification(triggers, date)`: 发送告警邮件
- `buildSubject(triggers, date)`: 构建邮件主题
- `buildBody(triggers)`: 构建邮件正文

**邮件格式：**

主题示例：
```
[Volatility Alert] Reached 8% intraday (Up) - 2025-10-11
```

正文示例：
```
Crypto Volatility Alert
==================================================

BTCUSDT hit 6% threshold (now +6.34%, price 68001.23, open 63990.00)
BTCUSDT hit 8% threshold (now +8.12%, price 69123.45, open 63990.00)

---
This is an automated alert from your crypto volatility monitoring service.
```

**依赖：** Resend SDK

### 5. 主控制流程 (`src/index.js`)

**职责：** 协调所有模块，实现完整的监控流程

**执行流程：**

```javascript
1. 读取环境变量 (SYMBOLS, RESEND_API_KEY, EMAIL_TO, EMAIL_FROM)

2. 计算当前日期和开盘时间
   - currentDate = getLocalDateStr('Asia/Shanghai')
   - startOfDayMs = getLocalStartOfDayMs('Asia/Shanghai')

3. 读取状态文件
   state = await readState()

4. 检查是否需要日切重置
   if (state.date !== currentDate) {
     // 创建新的初始状态
     state = createInitialState(currentDate, TIMEZONE, symbols)
     
     // 为每个 symbol 获取开盘价
     for (symbol of symbols) {
       openPrice = await getOpenPriceAtLocalMidnight(symbol, startOfDayMs)
       state.symbols[symbol].openPrice = openPrice
     }
   }

5. 遍历每个 symbol，检查价格波动
   for (symbol of symbols) {
     currentPrice = await getCurrentPrice(symbol)
     pct = (currentPrice - openPrice) / openPrice * 100
     absPct = Math.abs(pct)
     
     // 补齐式阈值检查
     while (absPct >= state.symbols[symbol].nextThresholdPct) {
       // 记录触发
       triggers.push({
         symbol,
         threshold: state.symbols[symbol].nextThresholdPct,
         pct,
         price: currentPrice,
         openPrice
       })
       
       // 推进到下一个阈值
       state.symbols[symbol].nextThresholdPct += THRESHOLD_STEP
     }
   }

6. 如果有触发，发送邮件
   if (triggers.length > 0) {
     await sendNotification(triggers, currentDate)
   }

7. 保存更新后的状态
   await writeState(state)
```

**配置常量：**
```javascript
const TIMEZONE = 'Asia/Shanghai';   // 时区
const INITIAL_THRESHOLD = 6;        // 首次告警阈值 (%)
const THRESHOLD_STEP = 2;           // 阈值递增步长 (%)
```

## 关键算法

### 1. 补齐式阈值推进

**场景：** 当价格快速波动时，一次运行可能跨越多个阈值

**示例：**
- 当前阈值：6%
- 当前涨跌幅：+9.5%
- 预期行为：应该触发 6% 和 8% 两次告警

**实现：**
```javascript
const symbolTriggers = [];
while (Math.abs(pct) >= state.symbols[symbol].nextThresholdPct) {
  // 记录触发
  symbolTriggers.push({
    symbol: symbol,
    threshold: state.symbols[symbol].nextThresholdPct,
    pct: pct,
    price: currentPrice,
    openPrice: symbolState.openPrice
  });
  
  // 递增阈值
  state.symbols[symbol].nextThresholdPct += THRESHOLD_STEP;
}
```

**优点：**
- 不会遗漏任何阈值
- 一封邮件包含所有触发的阈值
- 状态推进是原子的（要么全部成功，要么全部失败）

### 2. 日切重置逻辑

**判断条件：**
```javascript
if (!state || state.date !== currentDate) {
  // 需要重置
}
```

**重置动作：**
1. 创建新状态对象
2. 为每个 symbol 获取当日开盘价（00:00 后的第一根 1m K线）
3. 重置 `nextThresholdPct` 为 `INITIAL_THRESHOLD`
4. 保存新状态

**为什么用第一根 K线而非第一笔交易：**
- K线数据更稳定可靠
- 避免个别异常交易的影响
- API 调用简单高效

## 数据流

### 正常运行（日内）

```
1. GitHub Actions 定时触发
   ↓
2. 读取状态：date = "2025-10-11"，BTCUSDT.nextThresholdPct = 6
   ↓
3. 获取实时价格：BTCUSDT = 68500 (openPrice = 68000)
   ↓
4. 计算涨跌幅：pct = +0.74%
   ↓
5. 判断：0.74% < 6%，未触发
   ↓
6. 保存状态（无变化）
   ↓
7. 提交状态文件（无变化则 git diff 为空，不提交）
```

### 触发告警

```
1. GitHub Actions 定时触发
   ↓
2. 读取状态：date = "2025-10-11"，BTCUSDT.nextThresholdPct = 6
   ↓
3. 获取实时价格：BTCUSDT = 72500 (openPrice = 68000)
   ↓
4. 计算涨跌幅：pct = +6.62%
   ↓
5. 判断：6.62% >= 6%，触发！
   ↓
6. 记录 trigger: { symbol: "BTCUSDT", threshold: 6, pct: 6.62, ... }
   ↓
7. 递增阈值：nextThresholdPct = 8
   ↓
8. 继续判断：6.62% < 8%，停止
   ↓
9. 发送邮件：包含 BTCUSDT 6% 告警
   ↓
10. 保存状态：nextThresholdPct 已更新为 8
   ↓
11. 提交状态文件到仓库
```

### 日切重置

```
1. GitHub Actions 定时触发
   ↓
2. 读取状态：date = "2025-10-10" (旧日期)
   ↓
3. 当前日期：currentDate = "2025-10-11" (新日期)
   ↓
4. 判断：date !== currentDate，需要重置
   ↓
5. 计算今日 00:00 时间戳：1728583200000
   ↓
6. 获取 BTCUSDT 开盘价：调用 klines API
   ↓
7. 获取 ETHUSDT 开盘价：调用 klines API
   ↓
8. 获取 BNBUSDT 开盘价：调用 klines API
   ↓
9. 创建新状态：
   {
     date: "2025-10-11",
     symbols: {
       BTCUSDT: { openPrice: 69000, nextThresholdPct: 6 },
       ETHUSDT: { openPrice: 3500, nextThresholdPct: 6 },
       BNBUSDT: { openPrice: 520, nextThresholdPct: 6 }
     }
   }
   ↓
10. 保存并提交新状态
```

## 错误处理策略

### 1. API 调用失败

**策略：** 返回 null，上层跳过该 symbol

```javascript
const currentPrice = await getCurrentPrice(symbol);
if (currentPrice === null) {
  console.warn(`Failed to fetch current price for ${symbol}, skipping`);
  continue;  // 跳过该 symbol，继续处理其他
}
```

**好处：**
- 部分失败不影响其他 symbol
- 下次运行会重试
- 不会因为单个 symbol 失败而中断整个流程

### 2. 邮件发送失败

**策略：** 记录错误，但仍然推进状态

```javascript
const sent = await sendNotification(allTriggers, currentDate);
if (!sent) {
  console.error('? Failed to send notification');
  // 但状态仍然会保存，阈值已经推进
}
```

**权衡：**
- ? 避免重复告警（状态已推进）
- ? 可能丢失部分告警
- ? 可以通过查看 Actions 日志手动补发

### 3. 状态文件操作失败

**读取失败：**
```javascript
let state = await readState();
if (!state) {
  // 视为新的一天，创建初始状态
}
```

**写入失败：**
```javascript
const written = await writeState(state);
if (!written) {
  console.error('? Failed to save state');
  // 下次运行会重新计算
}
```

## 性能和限制

### API 调用频率

**每次运行：**
- Binance API：
  - 日切时：N 个 klines 调用（N = symbol 数量）
  - 正常时：N 个 price 调用
  - 总计：≤ 6 次/运行（3 个默认 symbol × 2）

**每天：**
- 每 5 分钟运行一次：288 次/天
- 日切发生 1 次：3 次 klines 调用
- 正常运行 287 次：861 次 price 调用
- **总计：864 次/天**

**币安限制：**
- 公共接口：1200 请求/分钟
- 我们的使用：< 1 请求/分钟
- **安全裕度：99.9%+**

### GitHub Actions 配额

**公开仓库：**
- 无限免费

**私有仓库：**
- 免费账户：2000 分钟/月
- 本项目每次运行：~30 秒
- 每月运行：288 × 30 = 8,640 次
- 每月消耗：8,640 × 0.5 分钟 = 4,320 分钟
- **注意：** 私有仓库会超出免费额度

**建议：**
- 使用公开仓库（完全免费）
- 或降低运行频率（如每 15 分钟）

### Resend 配额

**免费套餐：**
- 100 封邮件/月

**每封邮件可包含：**
- 多个 symbol 的多个阈值触发

**预估：**
- 假设每天有 2 个币种各触发 1 次：2 封/天
- 每月：~60 封
- **在免费额度内**

## 可扩展性

### 添加新币种

**限制：**
- 无硬性限制
- 建议 ≤ 20 个（保持运行时间 < 1 分钟）

**成本：**
- 每个 symbol 增加 1 次 API 调用/运行
- 日切时增加 1 次 klines 调用

### 修改检查频率

**当前：** 每 5 分钟

**可选：**
- 更频繁：每 1 分钟（高响应，高成本）
- 更稀疏：每 15 分钟（低成本，低响应）

**权衡：**
- 频率越高，越不会漏报快速波动
- 频率越低，越省 Actions 配额

### 添加其他通知渠道

**可扩展点：** `src/notifier.js`

**示例：**
- Telegram Bot
- Discord Webhook
- 企业微信
- 钉钉

**实现：**
```javascript
export async function sendNotification(triggers, date) {
  await sendEmail(triggers, date);      // 现有
  await sendTelegram(triggers, date);   // 新增
  await sendDiscord(triggers, date);    // 新增
}
```

## 安全性

### 密钥管理

- ? 使用 GitHub Secrets 存储敏感信息
- ? 不在代码中硬编码密钥
- ? `.env` 文件在 `.gitignore` 中

### API 安全

- ? 使用只读的公共 API（Binance）
- ? Resend API Key 仅有发送权限
- ? 无需交易所账号或交易权限

### 数据隐私

- ?? 状态文件提交到公开仓库
  - 包含：开盘价、阈值进度
  - 不包含：个人信息、密钥
  - 如需完全私密，使用私有仓库

## 测试

### 单元测试（建议添加）

```javascript
// test/time.test.js
import { getLocalDateStr } from '../src/time.js';
assert(getLocalDateStr('Asia/Shanghai').match(/^\d{4}-\d{2}-\d{2}$/));

// test/binance.test.js
import { getCurrentPrice } from '../src/binance.js';
const price = await getCurrentPrice('BTCUSDT');
assert(price > 0);
```

### 集成测试

使用 `test-config.js` 进行端到端测试：
```bash
npm run test-config
```

### 手动测试

1. 降低阈值到 1%
2. 手动触发 Actions
3. 检查邮件和状态文件

## 监控和日志

### 日志位置

- **GitHub Actions 日志：** Actions 标签页 → 运行记录 → check-volatility
- **状态变更历史：** 仓库 Commits → 筛选 "Update volatility state"

### 关键日志

```
=== Crypto Volatility Monitor Started ===
Monitoring symbols: BTCUSDT, ETHUSDT, BNBUSDT
Current date (Asia/Shanghai): 2025-10-11
...
Checking BTCUSDT...
Current price: 68500
Change: +0.74% (absolute: 0.74%)
Next threshold: 6%
...
? No thresholds crossed, no notification needed
? State saved successfully
=== Crypto Volatility Monitor Completed ===
```

### 告警指标

- ? Actions 运行成功率
- ? API 调用成功率
- ? 邮件发送成功率
- ? 状态文件更新频率

## 总结

这是一个轻量级、低成本、高可靠的加密货币波动监控系统：

- ? **简单：** 纯 JavaScript，无复杂框架
- ? **免费：** 公开仓库完全免费运行
- ? **安全：** 无需交易所密钥，仅使用公共 API
- ? **可靠：** 状态持久化，补齐式阈值不遗漏
- ? **精准：** 基于本地时区的日内波动计算
- ? **灵活：** 易于定制币种、阈值、通知方式

适合个人投资者、加密货币爱好者快速部署使用。

