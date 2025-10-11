# ���ٿ�ʼָ��

����һ�� 5 ���ӿ��ٲ���ָ�ϣ�����ļ��ܻ��Ҳ����澯������������������

## ���� 1��Fork �ֿ�

���ҳ�����Ͻǵ� **Fork** ��ť������Ŀ���Ƶ�����˺��¡�

## ���� 2����ȡ Resend API Key

1. ���� https://resend.com/signup ע���˺�
2. ��¼����� https://resend.com/api-keys
3. ��� **Create API Key**
4. �������ɵ� API Key����ʽ��`re_xxxxxxxxxxxx`��

### ���ڷ�������

Resend �ṩ���ַ�ʽ��

**ѡ�� A��ʹ�ò�����������죩**
- �������䣺`onboarding@resend.dev`
- ���ƣ�ֻ�ܷ�����ע�� Resend ʱ�õ�����
- �ʺϣ����ٲ���

**ѡ�� B��ʹ���Լ����������Ƽ���**
- �� Resend ������������
- ����ʾ���� DNS ��¼��MX��TXT��DKIM��
- ��֤ͨ����������ⷢ����ַ���� `alerts@yourdomain.com`��
- �ʺϣ���ʽʹ��

## ���� 3������ GitHub Secrets

���� Fork �Ĳֿ��У�

1. ���� **Settings**�����ã�
2. ������ **Secrets and variables** �� **Actions**
3. ��� **New repository secret** ������� 3 �� Secret��

| Name | Value | ˵�� |
|------|-------|------|
| `RESEND_API_KEY` | `re_xxxxxxxxxxxx` | ���� 2 ��ȡ�� API Key |
| `EMAIL_TO` | `your-email@example.com` | ���ո澯������ |
| `EMAIL_FROM` | `onboarding@resend.dev` �� `alerts@yourdomain.com` | �������� |

## ���� 4������ GitHub Actions дȨ��

1. �ڲֿ��н��� **Settings** �� **Actions** �� **General**
2. ������ҳ��ײ� **Workflow permissions**
3. ѡ�� ? **Read and write permissions**
4. ��� **Save**

���� Actions �����Զ��ύ״̬�ļ���

## ���� 5�����ò����Թ�����

1. ����ֿ�� **Actions** ��ǩҳ
2. ���������ʾ����� **I understand my workflows, go ahead and enable them**
3. ������ **Crypto Volatility Alert**
4. ����Ҳ� **Run workflow** �� **Run workflow** ���в���

### �鿴���н��

- ������м�¼�鿴��־
- ���������ȷ���ῴ�����ƣ�
  ```
  === Crypto Volatility Monitor Started ===
  Monitoring symbols: BTCUSDT, ETHUSDT, BNBUSDT
  Current date (Asia/Shanghai): 2025-10-11
  ...
  ? State saved successfully
  === Crypto Volatility Monitor Completed ===
  ```

## ���� 6���ȴ��澯

����һ�о������������᣺
- ? ÿ 5 �����Զ�����һ��
- ? ��� BTC��ETH��BNB �ļ۸񲨶�
- ? ���ǵ����ﵽ 6%��8%��10%... ʱ�����ʼ�

## �Զ�������

### �޸ļ�ر���

1. ���� **Settings** �� **Secrets and variables** �� **Actions**
2. �л��� **Variables** ��ǩҳ
3. ��� **New repository variable**
4. Name: `SYMBOLS`
5. Value: `BTCUSDT,ETHUSDT,BNBUSDT,SOLUSDT`���������Ҫ�ı��֣�

### �޸ļ��Ƶ��

�༭ `.github/workflows/volatility-alert.yml`��

```yaml
schedule:
  - cron: '*/10 * * * *'  # ��Ϊÿ 10 ����
```

## ��������

### ? Ϊʲôû�յ��ʼ���

1. ��������ʼ�/�����ʼ��ļ���
2. ȷ�� `EMAIL_TO` ���� Resend ע��ʱ�õ����䣨����ò���������
3. �鿴 Actions ��־��ȷ���Ƿ���Ĵﵽ����ֵ
4. ��ǰ�г��������ܲ����󣬿����ֶ��޸Ĵ�����ԣ�
   - �༭ `src/index.js`���� `INITIAL_THRESHOLD` ��Ϊ `1`��1% �͸澯��

### ? Actions ����ʧ��

���ԭ��
- ��������ĳ�� Secret
- ���ǿ��� Actions дȨ��

���������
1. ������� 3 �� Secret �Ƿ�������
2. ��� Actions дȨ���Ƿ���
3. �鿴 Actions ��־�еľ��������Ϣ

### ? ״̬�ļ��ύʧ��

������Ϣ��`Permission denied` �� `403`

��������������� 4 ���� Actions дȨ��

### ? Resend API ���� 403

- ��� API Key �Ƿ���ȷ���ƣ�û�ж���ո�
- ��� `EMAIL_FROM` �����Ƿ�����֤����ʹ�� `onboarding@resend.dev`��

## ��һ��

- ? �Ķ������� [README.md](./README.md) �˽���༼��ϸ��
- ? ������Ҫ������ֵ��Ƶ�ʵ�����
- ? �޸��ʼ�ģ�壨�༭ `src/notifier.js`��
- ? ��Ӹ����ر���

## ��Ҫ������

- �鿴 [�Ұ� API ״̬](https://www.binance.com/en/support/announcement)
- �鿴 [Resend �ĵ�](https://resend.com/docs)
- �鿴 [GitHub Actions �ĵ�](https://docs.github.com/en/actions)

��������Զ����澯����?

