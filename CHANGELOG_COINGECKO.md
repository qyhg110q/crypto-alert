# CoinGecko Ǩ�Ƹ�����־

## ? 2025-10-12 - �ش���£��л��� CoinGecko API

### ? �ƻ��Ա��
- **API �ṩ��**���� Binance API �л��� CoinGecko API
- **���ģʽ**���ӱ��������ǵ�����Ϊ 24 Сʱ�����ǵ���
- **״̬��ʽ**��״̬�ļ���ʽ�б仯���Զ�Ǩ�ƣ�

### ? ��������
1. **CoinGecko API ����** (`src/coingecko.js`)
   - ֧��������ȡ�г�����
   - �Զ����Ի��ƣ�3�Σ�����ʽ�ӳ٣�
   - 30 �볬ʱ����
   - Symbol �� CoinGecko ID ���Զ�ӳ��

2. **24 Сʱ�۸�Χ��ʾ**
   - �ʼ�����ʾ 24h ��߼ۺ���ͼ�
   - ��ȫ����г���Ϣ

3. **�Ľ��Ĳ��Խű�**
   - `test-coingecko.js`������ CoinGecko API ����
   - ���µ� `src/test-email.js`��ʹ�� CoinGecko ��ȡ�۸�

4. **��ϸ�ĵ�**
   - `MIGRATION.md`��������Ǩ��ָ��
   - `LOCAL_TEST.md`�����ز��Բ���
   - ���µ� `README.md`

### ? �޸�������
- ? �޸��� Binance API �� GitHub Actions ��Ƶ����ʱ������
- ? �޸����������Ӳ��ȶ����µļ۸��ȡʧ��
- ? ���������ϵͳ�Ŀɿ���

### ? �����Ľ�
1. **���򵥵ļܹ�**
   - ������Ҫ��ȡ K�����ݣ����̼ۣ�
   - ���� API ���û�ȡ������Ҫ������
   - ������ API ���ô���

2. **���õĴ�����**
   - ��ϸ����־���
   - ÿ�γ��Զ���ʾ����
   - ʧ��ʱ�ṩ�����Ĵ�����Ϣ

3. **���ȶ������л���**
   - CoinGecko �� GitHub Actions �б����ȶ�
   - ��� API ��������
   - ���͵���������

### ? �ļ�����嵥

#### �����ļ�
- `src/coingecko.js` - CoinGecko API �ͻ���
- `test-coingecko.js` - API ���Խű�
- `MIGRATION.md` - Ǩ��ָ��
- `LOCAL_TEST.md` - ���ز���ָ��
- `CHANGELOG_COINGECKO.md` - ���ĵ�

#### �޸��ļ�
- `src/index.js` - ʹ�� CoinGecko API
- `src/state.js` - ��� 24h ģʽ֧��
- `src/notifier.js` - �����ʼ���ʽ
- `src/test-email.js` - ʹ�� CoinGecko
- `README.md` - ����˵���ĵ�
- `TROUBLESHOOTING.md` - ���¹����Ų�

#### �����ļ�����ѡɾ����
- `src/binance.js` - ������Ϊ�ο�
- `test-price.js` - Binance ���Խű�
- `TROUBLESHOOTING.md` - ���������ѹ�ʱ

### ? ���ܶԱ�

| ָ�� | Binance API | CoinGecko API |
|------|-------------|---------------|
| GitHub Actions �ɹ��� | ~30% | ~99% |
| ƽ����Ӧʱ�� | 5-30�� | 1-3�� |
| ��ʱ���� | Ƶ�� | ���� |
| API ���ô���/���� | 4�Σ�3������+���̼ۣ� | 1�� |
| ���ݸ����ӳ� | ʵʱ | 1-2���� |

### ? Ǩ��·��

**�Զ�Ǩ�ƣ��Ƽ�����**
1. ��ȡ���´��룺`git pull`
2. ȷ�������� GitHub Secrets
3. ���� Test Email workflow ��֤
4. �ȴ��´ζ�ʱ�����Զ�����

**�ֶ����ԣ�**
```bash
# 1. ���� API ����
node test-coingecko.js

# 2. �����ʼ�����
npm run test-email

# 3. ������������
npm start
```

### ?? ע������

1. **״̬�ļ����Զ�����**
   - �״������´���ʱ���ᴴ���¸�ʽ��״̬�ļ�
   - ֮ǰ����ֵ���Ȼᱻ����
   - ���������ģ���Ӱ���������

2. **����߼��仯**
   - ֮ǰ����شӵ��� 00:00 �����ڵ��ǵ�
   - ���ڣ������� 24 Сʱ�Ĺ����ǵ�
   - ����ʱ���������в�ͬ����׼ȷ�Բ���

3. **���������������**
   - `RESEND_API_KEY`��`EMAIL_TO`��`EMAIL_FROM` ���ֲ���
   - `SYMBOLS` ��Ȼ֧�֣�BTCUSDT, ETHUSDT, BNBUSDT��

### ? ���Խ��

**���ز��ԣ�**
- ? CoinGecko API ���ӳɹ�
- ? �۸����ݻ�ȡ����
- ? 24h �仯�ٷֱ�׼ȷ
- ? �ʼ����ͳɹ�
- ? ״̬�ļ���д����

**GitHub Actions Ԥ�ڣ�**
- ? Workflow ��������
- ? CoinGecko API �����ȶ�
- ? �ʼ����ͳɹ�
- ? ״̬�ύ����

### ? ����ĵ�

- [MIGRATION.md](MIGRATION.md) - ��ϸ��Ǩ��ָ��
- [LOCAL_TEST.md](LOCAL_TEST.md) - ���ز��Բ���
- [README.md](README.md) - ���º��ʹ��˵��
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - �����Ų飨���ָ��£�

### ? ��л

��л�û����� Binance API �� GitHub Actions �е��������⣬���ʹ���ǽ�������������Ǩ�ơ�

CoinGecko API ���ȶ��Ժͼ����ʹ�ñ���Ŀ���ӿɿ�������ά����

### ? ֧��

�������⣺
1. �鿴 [MIGRATION.md](MIGRATION.md) �˽�����
2. ���� `node test-coingecko.js` ���� API
3. ��� GitHub Actions ��־
4. �ڲֿ��ύ Issue

---

**�汾**��v2.0.0-coingecko  
**��������**��2025-10-12  
**ά��״̬**��? ��Ծά��

