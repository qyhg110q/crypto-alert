# 快速开始指南

这是一个 5 分钟快速部署指南，让你的加密货币波动告警服务立即运行起来。

## 步骤 1：Fork 仓库

点击页面右上角的 **Fork** 按钮，将项目复制到你的账号下。

## 步骤 2：获取 Resend API Key

1. 访问 https://resend.com/signup 注册账号
2. 登录后进入 https://resend.com/api-keys
3. 点击 **Create API Key**
4. 复制生成的 API Key（格式：`re_xxxxxxxxxxxx`）

### 关于发件邮箱

Resend 提供两种方式：

**选项 A：使用测试域名（最快）**
- 发件邮箱：`onboarding@resend.dev`
- 限制：只能发到你注册 Resend 时用的邮箱
- 适合：快速测试

**选项 B：使用自己的域名（推荐）**
- 在 Resend 中添加你的域名
- 按提示配置 DNS 记录（MX、TXT、DKIM）
- 验证通过后可用任意发件地址（如 `alerts@yourdomain.com`）
- 适合：正式使用

## 步骤 3：配置 GitHub Secrets

在你 Fork 的仓库中：

1. 进入 **Settings**（设置）
2. 点击左侧 **Secrets and variables** → **Actions**
3. 点击 **New repository secret** 添加以下 3 个 Secret：

| Name | Value | 说明 |
|------|-------|------|
| `RESEND_API_KEY` | `re_xxxxxxxxxxxx` | 步骤 2 获取的 API Key |
| `EMAIL_TO` | `your-email@example.com` | 接收告警的邮箱 |
| `EMAIL_FROM` | `onboarding@resend.dev` 或 `alerts@yourdomain.com` | 发件邮箱 |

## 步骤 4：启用 GitHub Actions 写权限

1. 在仓库中进入 **Settings** → **Actions** → **General**
2. 滚动到页面底部 **Workflow permissions**
3. 选择 ? **Read and write permissions**
4. 点击 **Save**

这样 Actions 才能自动提交状态文件。

## 步骤 5：启用并测试工作流

1. 进入仓库的 **Actions** 标签页
2. 如果看到提示，点击 **I understand my workflows, go ahead and enable them**
3. 点击左侧 **Crypto Volatility Alert**
4. 点击右侧 **Run workflow** → **Run workflow** 进行测试

### 查看运行结果

- 点击运行记录查看日志
- 如果配置正确，会看到类似：
  ```
  === Crypto Volatility Monitor Started ===
  Monitoring symbols: BTCUSDT, ETHUSDT, BNBUSDT
  Current date (Asia/Shanghai): 2025-10-11
  ...
  ? State saved successfully
  === Crypto Volatility Monitor Completed ===
  ```

## 步骤 6：等待告警

现在一切就绪！工作流会：
- ? 每 5 分钟自动运行一次
- ? 监控 BTC、ETH、BNB 的价格波动
- ? 当涨跌幅达到 6%、8%、10%... 时发送邮件

## 自定义配置

### 修改监控币种

1. 进入 **Settings** → **Secrets and variables** → **Actions**
2. 切换到 **Variables** 标签页
3. 点击 **New repository variable**
4. Name: `SYMBOLS`
5. Value: `BTCUSDT,ETHUSDT,BNBUSDT,SOLUSDT`（添加你想要的币种）

### 修改检查频率

编辑 `.github/workflows/volatility-alert.yml`：

```yaml
schedule:
  - cron: '*/10 * * * *'  # 改为每 10 分钟
```

## 常见问题

### ? 为什么没收到邮件？

1. 检查垃圾邮件/促销邮件文件夹
2. 确认 `EMAIL_TO` 是你 Resend 注册时用的邮箱（如果用测试域名）
3. 查看 Actions 日志，确认是否真的达到了阈值
4. 当前市场波动可能不够大，可以手动修改代码测试：
   - 编辑 `src/index.js`，将 `INITIAL_THRESHOLD` 改为 `1`（1% 就告警）

### ? Actions 运行失败

最常见原因：
- 忘记配置某个 Secret
- 忘记开启 Actions 写权限

解决方法：
1. 检查所有 3 个 Secret 是否都配置了
2. 检查 Actions 写权限是否开启
3. 查看 Actions 日志中的具体错误信息

### ? 状态文件提交失败

错误信息：`Permission denied` 或 `403`

解决方法：按步骤 4 开启 Actions 写权限

### ? Resend API 返回 403

- 检查 API Key 是否正确复制（没有多余空格）
- 检查 `EMAIL_FROM` 域名是否已验证（或使用 `onboarding@resend.dev`）

## 下一步

- ? 阅读完整的 [README.md](./README.md) 了解更多技术细节
- ? 根据需要调整阈值、频率等配置
- ? 修改邮件模板（编辑 `src/notifier.js`）
- ? 添加更多监控币种

## 需要帮助？

- 查看 [币安 API 状态](https://www.binance.com/en/support/announcement)
- 查看 [Resend 文档](https://resend.com/docs)
- 查看 [GitHub Actions 文档](https://docs.github.com/en/actions)

享受你的自动化告警服务！?

