# ���ܻ������ڲ����澯����

�Զ���ؼ��ܻ��ҵ����ڲ��������ﵽ�趨��ֵʱͨ���ʼ����͸澯֪ͨ��

## ��������

- ? **�����������**��Ĭ�ϼ�� BTCUSDT��ETHUSDT��BNBUSDT
- ? **������ֵ�澯**���״� 6% �澯��֮��ÿ 2% ������8%��10%��12%...��
- ? **ÿ���Զ�����**��ÿ�� Asia/Shanghai ʱ�� 00:00 �Զ�����ͳ��
- ? **�ʼ���ʱ֪ͨ**��ͨ�� Resend ���͸澯�ʼ�
- ?? **GitHub Actions ����**���������������ȫ�й��� GitHub
- ? **״̬�־û�**���Զ�����״̬�������ظ��澯

## ����ԭ��

1. ÿ�� 00:00��Asia/Shanghai����ȡ���տ��̼���Ϊ��׼
2. ���ڣ�Ĭ��ÿ 5 ���ӣ��ӱҰ���ȡ���¼۸�
3. ������Կ��̼۵��ǵ���
4. ���ǵ�������ֵ�ﵽ��ֵʱ�����ʼ��澯
5. ״̬�Զ����浽�ֿ⣬�´�����ʱ����ʹ��

## ���ٿ�ʼ

### 1. Fork ���ֿ�

������Ͻ� **Fork** ��ť�����ֿ⸴�Ƶ���� GitHub �˺��¡�

### 2. ��ȡ Resend API Key

1. ���� [Resend](https://resend.com/) ��ע���˺�
2. �ڿ���̨���� API Key
3. ��Ӳ���֤��ķ�����������ʹ�� Resend �ṩ�Ĳ���������

### 3. ���� GitHub Secrets

����Ĳֿ��У����� **Settings �� Secrets and variables �� Actions**��������� Secrets��

| Secret Name | ���� | ʾ�� |
|------------|------|------|
| `RESEND_API_KEY` | Resend API ��Կ | `re_xxxxxxxxxxxxx` |
| `EMAIL_TO` | �ռ������� | `your-email@example.com` |
| `EMAIL_FROM` | ���������䣨���� Resend ����֤�� | `alerts@yourdomain.com` |

### 4. ����ѡ���Զ����ر���

�� **Settings �� Secrets and variables �� Actions �� Variables** ��ǩҳ�У���ӱ�����

| Variable Name | ���� | Ĭ��ֵ |
|--------------|------|--------|
| `SYMBOLS` | ��صĽ��׶ԣ����ŷָ��� | `BTCUSDT,ETHUSDT,BNBUSDT` |

### 5. ���� GitHub Actions

1. ����ֿ�� **Actions** ��ǩҳ
2. ���������ʾ����� **I understand my workflows, go ahead and enable them**
3. ������������һ�� 5 ���������Զ�����

### 6. �ֶ���������

���� **Actions** �� **Crypto Volatility Alert** �� **Run workflow** �����ֶ����ԡ�

## ���ؿ���

### ��װ����

```bash
npm install
```

### ���û�������

���� `.env.example` Ϊ `.env` ����д���ã�

```bash
cp .env.example .env
```

�༭ `.env` �ļ���

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_TO=your-email@example.com
EMAIL_FROM=alerts@yourdomain.com
SYMBOLS=BTCUSDT,ETHUSDT,BNBUSDT
```

### ����

```bash
npm start
```

## ����˵��

### �޸ļ��Ƶ��

�༭ `.github/workflows/volatility-alert.yml` �е� cron ���ʽ��

```yaml
schedule:
  - cron: '*/5 * * * *'  # ÿ 5 ��������һ��
```

�������ã�
- `*/5 * * * *` - ÿ 5 ����
- `*/10 * * * *` - ÿ 10 ����
- `*/15 * * * *` - ÿ 15 ����
- `0 * * * *` - ÿСʱ����

### �޸���ֵ����

�༭ `src/index.js` �еĳ�����

```javascript
const INITIAL_THRESHOLD = 6;  // �״θ澯��ֵ��%��
const THRESHOLD_STEP = 2;      // ��ֵ����������%��
```

### �޸�ʱ��

�༭ `src/index.js` �е�ʱ�����ã�

```javascript
const TIMEZONE = 'Asia/Shanghai';  // ������ IANA ʱ��
```

## �ʼ�ʾ��

**���⣺**
```
[Volatility Alert] Reached 8% intraday (Up) - 2025-10-11
```

**���ݣ�**
```
Crypto Volatility Alert
==================================================

BTCUSDT hit 6% threshold (now +6.34%, price 68001.23, open 63990.00)
BTCUSDT hit 8% threshold (now +8.12%, price 69123.45, open 63990.00)

---
This is an automated alert from your crypto volatility monitoring service.
```

## Ŀ¼�ṹ

```
.
������ .github/
��   ������ workflows/
��       ������ volatility-alert.yml   # GitHub Actions ������
������ .data/
��   ������ state.json                 # ״̬�־û��ļ����Զ����ɣ�
������ src/
��   ������ index.js                   # ���������
��   ������ binance.js                 # �Ұ� API ��װ
��   ������ time.js                    # ʱ�䴦����
��   ������ state.js                   # ״̬����
��   ������ notifier.js                # �ʼ�֪ͨ
������ package.json                   # ��Ŀ����
������ .env.example                   # ��������ģ��
������ README.md                      # ˵���ĵ�
```

## �����Ų�

### ����������ʧ��

1. ��� Secrets �Ƿ���ȷ����
2. �鿴 Actions ��־�еĴ�����Ϣ
3. ȷ�� `EMAIL_FROM` �������� Resend ����֤

### û���յ��ʼ�

1. ��������ʼ��ļ���
2. ȷ�� Resend API Key ��Ч
3. �鿴 Actions ��־ȷ���Ƿ�ﵽ��ֵ

### ״̬�ļ��ύʧ��

ȷ���ֿ�� Actions ��дȨ�ޣ�
**Settings �� Actions �� General �� Workflow permissions** ѡ�� **Read and write permissions**

## ����ջ

- **���л���**��Node.js 20
- **ʱ������**��Luxon
- **�ʼ�����**��Resend
- **����Դ**��Binance ���� API��������Կ��
- **����ƽ̨**��GitHub Actions

## ����Դ˵��

����Ŀʹ�ñҰ����� API�������κ��˺Ż���Կ��
- ʵʱ�۸�`/api/v3/ticker/price`
- K�����ݣ�`/api/v3/klines`

## ע������

- ? GitHub Actions ����˻�ÿ���� 2000 ����������Ŀÿ��Լʹ�� 150 ����
- ? Resend ����˻�ÿ�¿ɷ��� 100 ���ʼ�
- ? �ֿ�����ǹ����Ĳ���ʹ����ѵ� GitHub Actions����ʹ�� GitHub Pro��
- ? ʱ������Ϊ Asia/Shanghai��ÿ�� 00:00 ����ͳ��

## License

MIT License

## ����

��ӭ�ύ Issue �� Pull Request��

