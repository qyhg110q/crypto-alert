# 部署指南

详细的部署步骤和注意事项。

## 前置要求

- 一个 GitHub 账号
- 一个接收邮件的邮箱
- （可选）一个自己的域名用于发送邮件

## 详细部署步骤

### 1. 准备 Resend 账号和 API Key

#### 1.1 注册 Resend

1. 访问 [Resend 注册页面](https://resend.com/signup)
2. 使用邮箱注册（建议使用你想接收告警的邮箱）
3. 验证邮箱

#### 1.2 获取 API Key

1. 登录后访问 [API Keys 页面](https://resend.com/api-keys)
2. 点击 **Create API Key** 按钮
3. 输入名称（如 `crypto-alerts`）
4. 权限选择 **Sending access**
5. 点击 **Add** 创建
6. **立即复制并保存 API Key**（格式：`re_xxxxxxxxxxxx`）
   - ?? 这个 Key 只会显示一次，请妥善保存

#### 1.3 配置发件域名

**选项 A：使用 Resend 测试域名（快速开始）**

- 无需配置
- 发件地址：`onboarding@resend.dev`
- 限制：只能发送到你注册 Resend 时使用的邮箱
- 适合：测试和个人使用

**选项 B：使用自己的域名（推荐生产环境）**

1. 在 Resend 点击 [Domains](https://resend.com/domains)
2. 点击 **Add Domain**
3. 输入你的域名（如 `example.com`）
4. 按照提示在你的域名 DNS 管理面板添加以下记录：
   - **MX 记录**：用于接收退信
   - **TXT 记录**（SPF）：验证发件权限
   - **TXT 记录**（DKIM）：邮件签名
5. 等待 DNS 传播（通常 5-30 分钟）
6. 返回 Resend 点击 **Verify** 验证
7. 验证通过后，你可以使用该域名下的任意邮箱地址发送（如 `alerts@example.com`、`noreply@example.com`）

### 2. Fork 项目到你的 GitHub

1. 访问本项目的 GitHub 页面
2. 点击右上角 **Fork** 按钮
3. 选择你的账号，确认 Fork
4. 等待 Fork 完成

### 3. 配置 GitHub Secrets

在你 Fork 的仓库中进行配置：

#### 3.1 添加 Secrets

1. 进入你 Fork 的仓库
2. 点击顶部 **Settings**（设置）
3. 在左侧菜单找到 **Secrets and variables** → 点击 **Actions**
4. 在 **Secrets** 标签页，点击 **New repository secret**

添加以下 3 个 Secret（一次添加一个）：

| Name（名称） | Value（值） | 说明 |
|-------------|-----------|------|
| `RESEND_API_KEY` | `re_xxxxxxxxx` | 步骤 1.2 获取的 API Key |
| `EMAIL_TO` | `your-email@example.com` | 接收告警的邮箱地址 |
| `EMAIL_FROM` | `onboarding@resend.dev` 或 `alerts@yourdomain.com` | 发件邮箱地址 |

**重要提示：**
- 如果使用 Resend 测试域名（`onboarding@resend.dev`），`EMAIL_TO` 必须是你注册 Resend 时用的邮箱
- 如果使用自己的域名，`EMAIL_FROM` 必须是该域名下的地址，且域名已在 Resend 中验证

#### 3.2（可选）添加自定义监控币种

1. 在同一页面，切换到 **Variables** 标签页
2. 点击 **New repository variable**
3. Name: `SYMBOLS`
4. Value: `BTCUSDT,ETHUSDT,BNBUSDT` （或你想监控的币种，逗号分隔）

支持的币种可以在[币安市场](https://www.binance.com/zh-CN/markets)查看，使用格式如 `BTCUSDT`、`SOLUSDT` 等。

### 4. 配置 Actions 权限

这一步很重要，否则工作流无法自动提交状态文件。

1. 在仓库中，点击 **Settings**
2. 在左侧菜单找到 **Actions** → 点击 **General**
3. 滚动到页面底部的 **Workflow permissions** 部分
4. 选择 ? **Read and write permissions**
5. 勾选 ? **Allow GitHub Actions to create and approve pull requests**（可选）
6. 点击 **Save** 保存

### 5. 启用 GitHub Actions

1. 在仓库中，点击顶部 **Actions** 标签页
2. 如果看到提示 "Workflows aren't being run on this forked repository"
3. 点击绿色按钮 **I understand my workflows, go ahead and enable them**

### 6. 测试运行

#### 6.1 手动触发测试

1. 在 **Actions** 页面，点击左侧 **Crypto Volatility Alert**
2. 在右侧点击 **Run workflow** 下拉按钮
3. 点击绿色的 **Run workflow** 确认
4. 等待几秒钟，页面会出现一个新的运行记录

#### 6.2 查看运行结果

1. 点击刚创建的运行记录（会显示黄色的进行中图标 ? 或绿色的成功图标 ?）
2. 点击 **check-volatility** 任务
3. 展开各个步骤查看日志

**成功的标志：**
```
=== Crypto Volatility Monitor Started ===
Monitoring symbols: BTCUSDT, ETHUSDT, BNBUSDT
Current date (Asia/Shanghai): 2025-10-11
Start of day timestamp: ...
New day detected or no state exists. Initializing state for 2025-10-11...
BTCUSDT open price: 67890.12
ETHUSDT open price: 3456.78
BNBUSDT open price: 512.34
...
? No thresholds crossed, no notification needed
? State saved successfully
=== Crypto Volatility Monitor Completed ===
```

#### 6.3 检查状态文件

1. 回到仓库的 **Code** 标签页
2. 进入 `.data` 目录
3. 应该能看到自动创建的 `state.json` 文件
4. 点击查看，内容类似：
```json
{
  "date": "2025-10-11",
  "tz": "Asia/Shanghai",
  "symbols": {
    "BTCUSDT": {
      "openPrice": 67890.12,
      "nextThresholdPct": 6
    },
    ...
  }
}
```

### 7. 等待自动运行和告警

配置完成！现在：

- ? 工作流会每 5 分钟自动运行一次
- ? 监控配置的币种价格波动
- ? 当涨跌幅达到阈值时自动发送邮件到 `EMAIL_TO`
- ? 状态自动保存，避免重复告警

## 验证部署

### 方法 1：等待真实告警

如果当前市场波动不大，可能需要等待较长时间才能收到第一封告警邮件。

### 方法 2：降低阈值测试

1. 在仓库中编辑 `src/index.js`
2. 找到这两行：
   ```javascript
   const INITIAL_THRESHOLD = 6;  // 改为 1
   const THRESHOLD_STEP = 2;      // 改为 1
   ```
3. 改为：
   ```javascript
   const INITIAL_THRESHOLD = 1;  // 1% 就告警
   const THRESHOLD_STEP = 1;      // 每 1% 告警
   ```
4. 提交修改
5. 手动触发工作流（步骤 6.1）
6. 很快就会收到告警邮件
7. 测试完成后记得改回原值

### 方法 3：使用测试脚本（本地）

如果你想在本地测试配置：

1. 克隆你 Fork 的仓库到本地：
   ```bash
   git clone https://github.com/YOUR_USERNAME/CoinsListening.git
   cd CoinsListening
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 创建 `.env` 文件：
   ```bash
   cp .env.example .env
   ```

4. 编辑 `.env`，填入你的配置：
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxx
   EMAIL_TO=your-email@example.com
   EMAIL_FROM=onboarding@resend.dev
   SYMBOLS=BTCUSDT,ETHUSDT,BNBUSDT
   ```

5. 运行测试脚本：
   ```bash
   npm run test-config
   ```

   这会测试：
   - ? 环境变量是否配置正确
   - ? 币安 API 是否可访问
   - ? Resend API 是否工作正常
   - ? 发送一封测试邮件

6. 运行完整监控：
   ```bash
   npm start
   ```

## 常见问题排查

### 问题 1：Actions 运行失败，提示 "Error: Process completed with exit code 1"

**可能原因：**
- Secret 配置错误或缺失

**解决方法：**
1. 查看详细日志，找到具体错误信息
2. 确认 `RESEND_API_KEY`、`EMAIL_TO`、`EMAIL_FROM` 都已正确配置
3. 确认 API Key 没有多余的空格或换行

### 问题 2：收不到邮件

**可能原因：**
1. 邮件被归类为垃圾邮件
2. 使用测试域名但 `EMAIL_TO` 不是注册邮箱
3. 自定义域名未验证
4. 市场波动未达到阈值

**解决方法：**
1. 检查垃圾邮件/促销邮件文件夹
2. 如果使用 `onboarding@resend.dev`，确保 `EMAIL_TO` 是你注册 Resend 的邮箱
3. 在 Resend 检查域名验证状态
4. 查看 Actions 日志，确认是否有 "Threshold crossed" 提示
5. 临时降低阈值进行测试（方法 2）

### 问题 3：状态文件未自动提交

**错误信息：** `Permission denied` 或 `403 Forbidden`

**解决方法：**
- 确保已按步骤 4 开启 Actions 写权限
- 检查仓库设置中的 **Workflow permissions** 是否为 **Read and write**

### 问题 4：Resend API 返回 403 错误

**错误日志：** `Failed to send email: 403`

**可能原因：**
1. API Key 无效
2. 发件域名未验证

**解决方法：**
1. 在 Resend 重新检查 API Key 是否正确
2. 在 Resend Domains 页面确认域名状态为 "Verified"
3. 或改用 `onboarding@resend.dev` 测试

### 问题 5：币安 API 无法访问

**错误日志：** `Failed to fetch price` 或 `ENOTFOUND api.binance.com`

**可能原因：**
- 网络问题
- 币安 API 维护
- GitHub Actions 运行节点网络限制

**解决方法：**
1. 访问 [币安 API 状态页](https://www.binance.com/en/support/announcement) 确认服务状态
2. 等待几分钟后自动重试
3. 如果持续失败，考虑增加重试逻辑或使用代理

## 监控和维护

### 查看历史运行记录

- 进入仓库 **Actions** 标签页
- 查看所有历史运行记录
- 点击任意记录查看详细日志

### 查看状态文件变化

- 进入仓库 **Commits** 历史
- 筛选 "Update volatility state" 的提交
- 查看 `.data/state.json` 的变化历史

### 停止监控

**临时停止：**
1. 进入 **Actions** 页面
2. 点击左侧 **Crypto Volatility Alert**
3. 点击右上角 `...` 菜单
4. 选择 **Disable workflow**

**永久停止：**
- 删除 `.github/workflows/volatility-alert.yml` 文件

### 恢复监控

1. 进入 **Actions** 页面
2. 找到 **Crypto Volatility Alert**
3. 点击 **Enable workflow**

## 成本说明

### GitHub Actions

- 公开仓库：**完全免费，无限分钟数**
- 私有仓库：
  - 免费账户：2,000 分钟/月
  - 本项目每月约消耗 150 分钟（每 5 分钟运行一次）

### Resend

- 免费套餐：**100 封邮件/月**
- 付费套餐：$20/月，50,000 封邮件

### 币安 API

- **完全免费**
- 无需账号或密钥
- 公共行情接口，权重限制：1200 请求/分钟

**总结：** 如果使用公开仓库，本项目可以**完全免费**运行！

## 进阶配置

### 添加更多币种

编辑 `SYMBOLS` 变量，添加你想要的币种（逗号分隔）：

```
BTCUSDT,ETHUSDT,BNBUSDT,SOLUSDT,ADAUSDT,DOTUSDT
```

支持所有币安现货交易对，查看完整列表：
https://www.binance.com/zh-CN/markets

### 修改检查频率

编辑 `.github/workflows/volatility-alert.yml`：

```yaml
schedule:
  # 每 10 分钟：
  - cron: '*/10 * * * *'
  
  # 每 15 分钟：
  - cron: '*/15 * * * *'
  
  # 每小时：
  - cron: '0 * * * *'
  
  # 每天 9:00-23:00，每 5 分钟：
  - cron: '*/5 9-23 * * *'
```

### 修改阈值策略

编辑 `src/index.js`：

```javascript
// 首次 5% 告警，之后每 3% 递增
const INITIAL_THRESHOLD = 5;
const THRESHOLD_STEP = 3;

// 首次 10% 告警，之后每 5% 递增
const INITIAL_THRESHOLD = 10;
const THRESHOLD_STEP = 5;
```

### 自定义邮件模板

编辑 `src/notifier.js` 中的 `buildSubject` 和 `buildBody` 函数，自定义邮件格式。

## 升级和更新

当本项目有更新时：

1. 在你 Fork 的仓库页面，会看到 "This branch is X commits behind ..." 提示
2. 点击 **Sync fork** → **Update branch**
3. 或者手动合并：
   ```bash
   git remote add upstream https://github.com/ORIGINAL_REPO_URL
   git fetch upstream
   git merge upstream/main
   git push origin main
   ```

## 支持

如有问题，请：
1. 查看本文档的常见问题部分
2. 查看 GitHub Issues
3. 提交新的 Issue

祝使用愉快！?

