# �������� FAQ

## ��������

### Q1: �����Ŀ����ʲô�ģ�

��ؼ��ܻ��ң�BTC��ETH��BNB �ȣ������ڼ۸񲨶������ǵ����ﵽ 6%��8%��10% ����ֵʱ���Զ������ʼ����ѡ�

### Q2: ��Ҫ��Ǯ��

���ʹ�ù����ֿ⣬**��ȫ���**��
- GitHub Actions�������ֿ⣩���������
- Binance API����ѹ����ӿ�
- Resend �ʼ������ 100 ��/�£��㹻ʹ�ã�

### Q3: ��Ҫ�Ұ��˺���

**����Ҫ**������ֻʹ�ñҰ��Ĺ������� API������ע�ᡢ�����¼������ API ��Կ��

### Q4: ��ȫ��

**�ǳ���ȫ**��
- ���轻�����˺ź���Կ
- �޷������κν��ײ���
- ����ȡ�����ļ۸�����
- ������Կ�洢�� GitHub Secrets ��

### Q5: ֧����Щ���֣�

֧�ֱҰ������ֻ����׶ԣ�Ĭ�ϼ�أ�
- BTCUSDT�����رң�
- ETHUSDT����̫����
- BNBUSDT���Ұ��ң�

���Զ�����ӣ�SOLUSDT��ADAUSDT��DOTUSDT��XRPUSDT �ȡ�

�鿴�����б�https://www.binance.com/zh-CN/markets

---

## ��������

### Q6: Fork ����Ҫ��ʲô��

�������Ĳ��裺
1. ��ȡ Resend API Key
2. �� GitHub �ֿ����� 3 �� Secrets��API Key���ռ����䡢�������䣩
3. ���� Actions дȨ��

�����[QUICKSTART.md](./QUICKSTART.md)

### Q7: Resend ��ʲô����ôע�᣿

Resend ��һ���ʼ����ͷ������� SendGrid����

ע�Ჽ�裺
1. ���� https://resend.com/signup
2. ʹ������ע�ᣨ�����ý��ո澯�����䣩
3. ��¼���� https://resend.com/api-keys ���� API Key

��ȫ��ѣ�100 ��/���㹻ʹ�á�

### Q8: ����������ô���ã�

**���� A�����ٿ�ʼ����**
- ʹ�� Resend ��������
- ������ַ��`onboarding@resend.dev`
- ���ƣ�ֻ�ܷ���ע�� Resend ʱ�õ�����

**���� B���Ƽ�����**
- ʹ���Լ����������� `alerts@yourdomain.com`��
- ��Ҫ������ DNS ���� MX��SPF��DKIM ��¼
- ���ú�ɷ�����������

�����[DEPLOYMENT.md](./DEPLOYMENT.md)

### Q9: ˽�вֿ��������

���ԣ��������� Actions ��
- ����˻���2000 ����/��
- ����Ŀÿ��Լ���ģ�150 ���ӣ�ÿ 5 �������У�

**����ʹ�ù����ֿ�**��������ѣ���״̬�ļ�������������Ϣ��

---

## ��������

### Q10: ��ô�޸ļ�صı��֣�

�� GitHub �ֿ������У�
1. **Settings** �� **Secrets and variables** �� **Actions**
2. �л��� **Variables** ��ǩҳ
3. ��ӱ��� `SYMBOLS`��ֵ�磺`BTCUSDT,ETHUSDT,SOLUSDT,ADAUSDT`

### Q11: ��ô�޸ļ��Ƶ�ʣ�

�༭ `.github/workflows/volatility-alert.yml`��

```yaml
schedule:
  - cron: '*/5 * * * *'   # ÿ 5 ���ӣ�Ĭ�ϣ�
  - cron: '*/10 * * * *'  # ÿ 10 ����
  - cron: '*/15 * * * *'  # ÿ 15 ����
  - cron: '0 * * * *'     # ÿСʱ
```

### Q12: ��ô�޸ĸ澯��ֵ��

�༭ `src/index.js`��

```javascript
const INITIAL_THRESHOLD = 6;  // ��Ϊ 5��10 ��
const THRESHOLD_STEP = 2;     // ��Ϊ 1��3��5 ��
```

�����Ϊ 10% ��ÿ�� 5% ������
```javascript
const INITIAL_THRESHOLD = 10;
const THRESHOLD_STEP = 5;
```

### Q13: ��ô��ʱ����

�༭ `src/index.js`��

```javascript
const TIMEZONE = 'Asia/Shanghai';  // ��Ϊ���� IANA ʱ��
```

����ʱ����
- `Asia/Shanghai`���й���
- `America/New_York`��ŦԼ��
- `Europe/London`���׶أ�
- `Asia/Tokyo`��������

---

## ʹ������

### Q14: ��û��յ���һ���ʼ���

ȡ�����г�������
- �������籩�Ǳ����������ܼ�Сʱ��
- ����С�����̣������ܼ�����������

������ʱ������ֵ���ԣ���Ϊ 1% �� 2%����

### Q15: Ϊʲô�ղ����ʼ���

����嵥��
1. ? ��������ʼ�/�����ʼ��ļ���
2. ? ȷ�� Secrets ������ȷ���޶���ո�
3. ? ����� `onboarding@resend.dev`��ȷ�� `EMAIL_TO` ��ע������
4. ? �鿴 Actions ��־��ȷ���Ƿ�ﵽ��ֵ
5. ? �� Resend �鿴������ʷ��https://resend.com/emails��

### Q16: һ����յ����ٷ��ʼ���

��ȷ����ȡ�����г�������
- ƽ��ʱ��0 ��
- ����ʱ��ÿ������ 1-5 �⣨6%��8%��10%...��
- ���˲��������ܸ���

һ���ʼ����ܰ�������澯����ͬʱ���� 6% �� 8%����

### Q17: ��ô��ͣ��أ�

**���� 1����ʱ����**
1. ���� **Actions** ҳ��
2. ��� **Crypto Volatility Alert**
3. ��� `...` �˵� �� **Disable workflow**

**���� 2�����ã���**
- ɾ���ֿ�� `.github/workflows/volatility-alert.yml` �ļ�

### Q18: ��ô�ָ���أ�

�� Actions ҳ�棬�ҵ������������ **Enable workflow**��

---

## �����Ų�

### Q19: Actions ����ʧ�ܣ���ʾ "Permission denied"

**ԭ��** δ���� Actions дȨ��

**�����**
1. **Settings** �� **Actions** �� **General**
2. ������ **Workflow permissions**
3. ѡ�� ? **Read and write permissions**
4. ��� **Save**

### Q20: Resend ���� 403 ����

**����ԭ��**
1. API Key ����
2. ��������δ��֤

**�����**
1. ���¼�� `RESEND_API_KEY` �Ƿ���ȷ
2. �� Resend Domains ҳ��ȷ������״̬Ϊ "Verified"
3. ����� `onboarding@resend.dev` ����

### Q21: �Ұ� API �޷�����

**����ԭ��**
1. ��������
2. �Ұ� API ά��
3. GitHub Actions IP ������

**�����**
1. �鿴 [�Ұ�����](https://www.binance.com/en/support/announcement)
2. �ȴ������Ӻ��Զ�����
3. �������ʧ�ܣ����Ұ� API ״̬

### Q22: ״̬�ļ�û���Զ��ύ

**ԭ��** Ȩ�����û� git ��������

**��飺**
1. ȷ�� Actions дȨ���ѿ�����Q19��
2. �鿴 Actions ��־�е� "Commit and push state changes" ����
3. ȷ�� `.data/state.json` ȷʵ�б仯

### Q23: ���гɹ���ʲô�������

**����������**��˵����
- ? �Ұ� API ���óɹ�
- ? �۸��ȡ�ɹ�
- ? δ�ﵽ�澯��ֵ
- ? ״̬�ѱ���

�鿴��־Ӧ�������������
```
? No thresholds crossed, no notification needed
```

---

## ��������

### Q24: ���Լ�غ�Լ/�ڻ���

��ǰ�汾��֧���ֻ��������Լ���ݣ����޸� `src/binance.js` �е� API �˵㣺
- �ֻ���`https://api.binance.com`
- ��Լ��`https://fapi.binance.com`

### Q25: �������������������

���ԣ���Ҫ�޸� `src/binance.js` �������������� API���磺
- OKX��https://www.okx.com/docs-v5/
- Bybit��https://bybit-exchange.github.io/docs/
- Gate.io��https://www.gate.io/docs/developers/apiv4/

### Q26: �����Զ����ʼ�ģ����

���ԣ��༭ `src/notifier.js` �е� `buildSubject` �� `buildBody` ������

ʾ������� HTML ��ʽ
```javascript
await resend.emails.send({
  from: emailFrom,
  to: emailTo,
  subject: subject,
  html: buildHtmlBody(triggers)  // �Զ��� HTML ģ��
});
```

### Q27: �����������֪ͨ��ʽ��

���ԣ��� `src/notifier.js` ������º�����

```javascript
// Telegram Bot
export async function sendTelegram(triggers) {
  // ���� Telegram Bot API
}

// Discord Webhook
export async function sendDiscord(triggers) {
  // ���� Discord Webhook
}
```

### Q28: ���Ա�����ʷ������

��ǰ�汾ֻ���浱��״̬��������ʷ���ݣ����ԣ�
1. ��ÿ������ʱ������׷�ӵ� `.data/history.json`
2. ��������ݿ⣨�� Supabase��MongoDB Atlas ��Ѱ棩
3. ��ʹ�� GitHub Issues ��Ϊ�򵥵����ݴ洢

### Q29: ��ô���ؿ����͵��ԣ�

```bash
# 1. ��¡�ֿ�
git clone https://github.com/YOUR_USERNAME/CoinsListening.git
cd CoinsListening

# 2. ��װ����
npm install

# 3. ���û�������
cp .env.example .env
# �༭ .env �����������

# 4. ���в���
npm run test-config

# 5. ����������
npm start
```

### Q30: ������������������

���ԣ������飺
1. ? ʹ���Լ������������ʼ�����רҵ��
2. ? ��� Resend ���������ⳬ�ޣ�
3. ? ��ӵ�Ԫ���Ժͼ��ɲ���
4. ? ���ø澯��Actions ʧ��ʱ֪ͨ��
5. ? ���ڲ鿴 Actions ��־ȷ����������

---

## ��������

### Q31: ���ݴ���������

- **�۸�����**���Ұ����� API�������˺ţ�
- **���̼�**��ÿ�� 00:00 (Asia/Shanghai) ��һ�� 1 ���� K ��

### Q32: �ǵ�����ô���㣿

```
�ǵ��� = (��ǰ�۸� - ���̼�) / ���̼� �� 100%
```

ʾ����
- ���̼ۣ�10000
- ��ǰ�۸�10600
- �ǵ�����(10600 - 10000) / 10000 �� 100% = +6%

### Q33: Ϊʲô����"����"���� 24 Сʱ��

���ڣ�00:00-23:59�������ϴ�ͳ�����г���ͳ��ϰ�ߣ����ڣ�
- ÿ�ո����ܽ�
- �ԱȲ�ͬ���ڵĲ���
- �뽻������ʾ�����ǵ�������

### Q34: ״̬�ļ���ܴ���

���ᣬÿ������ֻռ���У�
```json
{
  "date": "2025-10-11",
  "tz": "Asia/Shanghai",
  "symbols": {
    "BTCUSDT": { "openPrice": 67890.12, "nextThresholdPct": 6 }
  }
}
```

10 ������Լ 500 �ֽڣ����Ժ��Բ��ơ�

### Q35: ֧������������

��ǰ������Ӣ��+����ע�͡��ʼ����ݿ����� `src/notifier.js` �и�Ϊ�κ����ԡ�

### Q36: ������ȥ����������

1. �鿴�� FAQ
2. �鿴 [README.md](./README.md)��[DEPLOYMENT.md](./DEPLOYMENT.md)
3. �鿴 Actions ��־�еĴ�����Ϣ
4. �� GitHub �ύ Issue

---

## ��������

- ? [README - ��Ŀ����](./README.md)
- ? [QUICKSTART - 5���ӿ��ٿ�ʼ](./QUICKSTART.md)
- ? [DEPLOYMENT - ��ϸ����ָ��](./DEPLOYMENT.md)
- ?? [ARCHITECTURE - �ܹ�˵��](./ARCHITECTURE.md)

�������⣿��ӭ�ύ Issue��

