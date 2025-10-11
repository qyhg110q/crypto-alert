# ����ָ��

��ϸ�Ĳ������ע�����

## ǰ��Ҫ��

- һ�� GitHub �˺�
- һ�������ʼ�������
- ����ѡ��һ���Լ����������ڷ����ʼ�

## ��ϸ������

### 1. ׼�� Resend �˺ź� API Key

#### 1.1 ע�� Resend

1. ���� [Resend ע��ҳ��](https://resend.com/signup)
2. ʹ������ע�ᣨ����ʹ��������ո澯�����䣩
3. ��֤����

#### 1.2 ��ȡ API Key

1. ��¼����� [API Keys ҳ��](https://resend.com/api-keys)
2. ��� **Create API Key** ��ť
3. �������ƣ��� `crypto-alerts`��
4. Ȩ��ѡ�� **Sending access**
5. ��� **Add** ����
6. **�������Ʋ����� API Key**����ʽ��`re_xxxxxxxxxxxx`��
   - ?? ��� Key ֻ����ʾһ�Σ������Ʊ���

#### 1.3 ���÷�������

**ѡ�� A��ʹ�� Resend �������������ٿ�ʼ��**

- ��������
- ������ַ��`onboarding@resend.dev`
- ���ƣ�ֻ�ܷ��͵���ע�� Resend ʱʹ�õ�����
- �ʺϣ����Ժ͸���ʹ��

**ѡ�� B��ʹ���Լ����������Ƽ�����������**

1. �� Resend ��� [Domains](https://resend.com/domains)
2. ��� **Add Domain**
3. ��������������� `example.com`��
4. ������ʾ��������� DNS �������������¼�¼��
   - **MX ��¼**�����ڽ�������
   - **TXT ��¼**��SPF������֤����Ȩ��
   - **TXT ��¼**��DKIM�����ʼ�ǩ��
5. �ȴ� DNS ������ͨ�� 5-30 ���ӣ�
6. ���� Resend ��� **Verify** ��֤
7. ��֤ͨ���������ʹ�ø������µ����������ַ���ͣ��� `alerts@example.com`��`noreply@example.com`��

### 2. Fork ��Ŀ����� GitHub

1. ���ʱ���Ŀ�� GitHub ҳ��
2. ������Ͻ� **Fork** ��ť
3. ѡ������˺ţ�ȷ�� Fork
4. �ȴ� Fork ���

### 3. ���� GitHub Secrets

���� Fork �Ĳֿ��н������ã�

#### 3.1 ��� Secrets

1. ������ Fork �Ĳֿ�
2. ������� **Settings**�����ã�
3. �����˵��ҵ� **Secrets and variables** �� ��� **Actions**
4. �� **Secrets** ��ǩҳ����� **New repository secret**

������� 3 �� Secret��һ�����һ������

| Name�����ƣ� | Value��ֵ�� | ˵�� |
|-------------|-----------|------|
| `RESEND_API_KEY` | `re_xxxxxxxxx` | ���� 1.2 ��ȡ�� API Key |
| `EMAIL_TO` | `your-email@example.com` | ���ո澯�������ַ |
| `EMAIL_FROM` | `onboarding@resend.dev` �� `alerts@yourdomain.com` | ���������ַ |

**��Ҫ��ʾ��**
- ���ʹ�� Resend ����������`onboarding@resend.dev`����`EMAIL_TO` ��������ע�� Resend ʱ�õ�����
- ���ʹ���Լ���������`EMAIL_FROM` �����Ǹ������µĵ�ַ������������ Resend ����֤

#### 3.2����ѡ������Զ����ر���

1. ��ͬһҳ�棬�л��� **Variables** ��ǩҳ
2. ��� **New repository variable**
3. Name: `SYMBOLS`
4. Value: `BTCUSDT,ETHUSDT,BNBUSDT` ���������صı��֣����ŷָ���

֧�ֵı��ֿ�����[�Ұ��г�](https://www.binance.com/zh-CN/markets)�鿴��ʹ�ø�ʽ�� `BTCUSDT`��`SOLUSDT` �ȡ�

### 4. ���� Actions Ȩ��

��һ������Ҫ�����������޷��Զ��ύ״̬�ļ���

1. �ڲֿ��У���� **Settings**
2. �����˵��ҵ� **Actions** �� ��� **General**
3. ������ҳ��ײ��� **Workflow permissions** ����
4. ѡ�� ? **Read and write permissions**
5. ��ѡ ? **Allow GitHub Actions to create and approve pull requests**����ѡ��
6. ��� **Save** ����

### 5. ���� GitHub Actions

1. �ڲֿ��У�������� **Actions** ��ǩҳ
2. ���������ʾ "Workflows aren't being run on this forked repository"
3. �����ɫ��ť **I understand my workflows, go ahead and enable them**

### 6. ��������

#### 6.1 �ֶ���������

1. �� **Actions** ҳ�棬������ **Crypto Volatility Alert**
2. ���Ҳ��� **Run workflow** ������ť
3. �����ɫ�� **Run workflow** ȷ��
4. �ȴ������ӣ�ҳ������һ���µ����м�¼

#### 6.2 �鿴���н��

1. ����մ��������м�¼������ʾ��ɫ�Ľ�����ͼ�� ? ����ɫ�ĳɹ�ͼ�� ?��
2. ��� **check-volatility** ����
3. չ����������鿴��־

**�ɹ��ı�־��**
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

#### 6.3 ���״̬�ļ�

1. �ص��ֿ�� **Code** ��ǩҳ
2. ���� `.data` Ŀ¼
3. Ӧ���ܿ����Զ������� `state.json` �ļ�
4. ����鿴���������ƣ�
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

### 7. �ȴ��Զ����к͸澯

������ɣ����ڣ�

- ? ��������ÿ 5 �����Զ�����һ��
- ? ������õı��ּ۸񲨶�
- ? ���ǵ����ﵽ��ֵʱ�Զ������ʼ��� `EMAIL_TO`
- ? ״̬�Զ����棬�����ظ��澯

## ��֤����

### ���� 1���ȴ���ʵ�澯

�����ǰ�г��������󣬿�����Ҫ�ȴ��ϳ�ʱ������յ���һ��澯�ʼ���

### ���� 2��������ֵ����

1. �ڲֿ��б༭ `src/index.js`
2. �ҵ������У�
   ```javascript
   const INITIAL_THRESHOLD = 6;  // ��Ϊ 1
   const THRESHOLD_STEP = 2;      // ��Ϊ 1
   ```
3. ��Ϊ��
   ```javascript
   const INITIAL_THRESHOLD = 1;  // 1% �͸澯
   const THRESHOLD_STEP = 1;      // ÿ 1% �澯
   ```
4. �ύ�޸�
5. �ֶ����������������� 6.1��
6. �ܿ�ͻ��յ��澯�ʼ�
7. ������ɺ�ǵøĻ�ԭֵ

### ���� 3��ʹ�ò��Խű������أ�

��������ڱ��ز������ã�

1. ��¡�� Fork �Ĳֿ⵽���أ�
   ```bash
   git clone https://github.com/YOUR_USERNAME/CoinsListening.git
   cd CoinsListening
   ```

2. ��װ������
   ```bash
   npm install
   ```

3. ���� `.env` �ļ���
   ```bash
   cp .env.example .env
   ```

4. �༭ `.env`������������ã�
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxx
   EMAIL_TO=your-email@example.com
   EMAIL_FROM=onboarding@resend.dev
   SYMBOLS=BTCUSDT,ETHUSDT,BNBUSDT
   ```

5. ���в��Խű���
   ```bash
   npm run test-config
   ```

   �����ԣ�
   - ? ���������Ƿ�������ȷ
   - ? �Ұ� API �Ƿ�ɷ���
   - ? Resend API �Ƿ�������
   - ? ����һ������ʼ�

6. ����������أ�
   ```bash
   npm start
   ```

## ���������Ų�

### ���� 1��Actions ����ʧ�ܣ���ʾ "Error: Process completed with exit code 1"

**����ԭ��**
- Secret ���ô����ȱʧ

**���������**
1. �鿴��ϸ��־���ҵ����������Ϣ
2. ȷ�� `RESEND_API_KEY`��`EMAIL_TO`��`EMAIL_FROM` ������ȷ����
3. ȷ�� API Key û�ж���Ŀո����

### ���� 2���ղ����ʼ�

**����ԭ��**
1. �ʼ�������Ϊ�����ʼ�
2. ʹ�ò��������� `EMAIL_TO` ����ע������
3. �Զ�������δ��֤
4. �г�����δ�ﵽ��ֵ

**���������**
1. ��������ʼ�/�����ʼ��ļ���
2. ���ʹ�� `onboarding@resend.dev`��ȷ�� `EMAIL_TO` ����ע�� Resend ������
3. �� Resend ���������֤״̬
4. �鿴 Actions ��־��ȷ���Ƿ��� "Threshold crossed" ��ʾ
5. ��ʱ������ֵ���в��ԣ����� 2��

### ���� 3��״̬�ļ�δ�Զ��ύ

**������Ϣ��** `Permission denied` �� `403 Forbidden`

**���������**
- ȷ���Ѱ����� 4 ���� Actions дȨ��
- ���ֿ������е� **Workflow permissions** �Ƿ�Ϊ **Read and write**

### ���� 4��Resend API ���� 403 ����

**������־��** `Failed to send email: 403`

**����ԭ��**
1. API Key ��Ч
2. ��������δ��֤

**���������**
1. �� Resend ���¼�� API Key �Ƿ���ȷ
2. �� Resend Domains ҳ��ȷ������״̬Ϊ "Verified"
3. ����� `onboarding@resend.dev` ����

### ���� 5���Ұ� API �޷�����

**������־��** `Failed to fetch price` �� `ENOTFOUND api.binance.com`

**����ԭ��**
- ��������
- �Ұ� API ά��
- GitHub Actions ���нڵ���������

**���������**
1. ���� [�Ұ� API ״̬ҳ](https://www.binance.com/en/support/announcement) ȷ�Ϸ���״̬
2. �ȴ������Ӻ��Զ�����
3. �������ʧ�ܣ��������������߼���ʹ�ô���

## ��غ�ά��

### �鿴��ʷ���м�¼

- ����ֿ� **Actions** ��ǩҳ
- �鿴������ʷ���м�¼
- ��������¼�鿴��ϸ��־

### �鿴״̬�ļ��仯

- ����ֿ� **Commits** ��ʷ
- ɸѡ "Update volatility state" ���ύ
- �鿴 `.data/state.json` �ı仯��ʷ

### ֹͣ���

**��ʱֹͣ��**
1. ���� **Actions** ҳ��
2. ������ **Crypto Volatility Alert**
3. ������Ͻ� `...` �˵�
4. ѡ�� **Disable workflow**

**����ֹͣ��**
- ɾ�� `.github/workflows/volatility-alert.yml` �ļ�

### �ָ����

1. ���� **Actions** ҳ��
2. �ҵ� **Crypto Volatility Alert**
3. ��� **Enable workflow**

## �ɱ�˵��

### GitHub Actions

- �����ֿ⣺**��ȫ��ѣ����޷�����**
- ˽�вֿ⣺
  - ����˻���2,000 ����/��
  - ����Ŀÿ��Լ���� 150 ���ӣ�ÿ 5 ��������һ�Σ�

### Resend

- ����ײͣ�**100 ���ʼ�/��**
- �����ײͣ�$20/�£�50,000 ���ʼ�

### �Ұ� API

- **��ȫ���**
- �����˺Ż���Կ
- ��������ӿڣ�Ȩ�����ƣ�1200 ����/����

**�ܽ᣺** ���ʹ�ù����ֿ⣬����Ŀ����**��ȫ���**���У�

## ��������

### ��Ӹ������

�༭ `SYMBOLS` �������������Ҫ�ı��֣����ŷָ�����

```
BTCUSDT,ETHUSDT,BNBUSDT,SOLUSDT,ADAUSDT,DOTUSDT
```

֧�����бҰ��ֻ����׶ԣ��鿴�����б�
https://www.binance.com/zh-CN/markets

### �޸ļ��Ƶ��

�༭ `.github/workflows/volatility-alert.yml`��

```yaml
schedule:
  # ÿ 10 ���ӣ�
  - cron: '*/10 * * * *'
  
  # ÿ 15 ���ӣ�
  - cron: '*/15 * * * *'
  
  # ÿСʱ��
  - cron: '0 * * * *'
  
  # ÿ�� 9:00-23:00��ÿ 5 ���ӣ�
  - cron: '*/5 9-23 * * *'
```

### �޸���ֵ����

�༭ `src/index.js`��

```javascript
// �״� 5% �澯��֮��ÿ 3% ����
const INITIAL_THRESHOLD = 5;
const THRESHOLD_STEP = 3;

// �״� 10% �澯��֮��ÿ 5% ����
const INITIAL_THRESHOLD = 10;
const THRESHOLD_STEP = 5;
```

### �Զ����ʼ�ģ��

�༭ `src/notifier.js` �е� `buildSubject` �� `buildBody` �������Զ����ʼ���ʽ��

## �����͸���

������Ŀ�и���ʱ��

1. ���� Fork �Ĳֿ�ҳ�棬�ῴ�� "This branch is X commits behind ..." ��ʾ
2. ��� **Sync fork** �� **Update branch**
3. �����ֶ��ϲ���
   ```bash
   git remote add upstream https://github.com/ORIGINAL_REPO_URL
   git fetch upstream
   git merge upstream/main
   git push origin main
   ```

## ֧��

�������⣬�룺
1. �鿴���ĵ��ĳ������ⲿ��
2. �鿴 GitHub Issues
3. �ύ�µ� Issue

ףʹ����죡?

