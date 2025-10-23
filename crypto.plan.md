# ���ܻ��Ҳ����澯�� Hyperdash �ɽ�������GitHub Actions + Resend��

## ��Χ��Ŀ��

- �۸񲨶��澯����� `BTCUSDT, ETHUSDT, BNBUSDT` �� 24 Сʱ�ǵ�����CoinGecko����
- ��ֵ�� 6% ��֮��ÿ������һ�λ����� +2%��8%��10%��12% ...����ÿ�� Asia/Shanghai 00:00 ���á�
- �ɽ����������� Hyperdash/Hyperliquid ��ָ����ַ���û��ɽ���userFills������ͨ���ʼ�֪ͨ��
  - Ŀ���ַ��
    - `0xc2a30212a8ddac9e123944d6e29faddce994e5f2`
    - `0xb317d2bc2d3d2df5fa441b5bae0ab9d8b07283ae`
  - ÿ������ץȡ���³ɽ����뱾��״̬ȥ�أ����������ɽ������ʼ���

## ����ջ

- Node.js 20������ fetch����
- Resend �ٷ� Node SDK���ʼ�����
- Luxon ����ʱ����Asia/Shanghai����
- CoinGecko �г����ݣ�24h �ǵ���۸񣩡�
- Hyperdash/Hyperliquid �ɽ����ݣ�
  - ��ѡ `https://api.hyperliquid.xyz/info`��POST��type=userFills����
  - ��ѡ `https://api.hypereth.io/v2/hyperliquid/getUserFills`���������� `HYPERETH_API_KEY`����

## �ļ��ṹ

- `src/index.js`�������̣��۸��� + �ɽ���������
- `src/coingecko.js`��CoinGecko API �ͻ��ˡ�
- `src/hyperdash.js`��Hyperdash/Hyperliquid userFills �ͻ��ˣ����ԡ���ʱ����
- `src/hyperdash_state.js`��`.data/hyperdash.json` ״̬��д��ÿ��ַ `lastTimestamp` ����� `seenIds`����
- `src/notifier.js`��
  - `sendNotification()`���۸���ֵ�澯��
  - `sendHyperdashFillsEmail()`���ɽ��ʼ�֪ͨ������ַ���ܣ���

## Hyperdash �ɽ���������

1. �ӻ�����ȡ��ʹ��Ĭ�ϵ�ַ�б�
   - `HYPERDASH_ADDRESSES`��CSV����Ĭ��Ϊ����������ַ��
2. ��ȡ `hyperdash.json` ״̬�������������ʼ����ÿ��ַ `lastTimestamp=0`��`seenIds=[]`����
3. ���ַ���� userFills �ӿڣ����� hyperliquid `info`����ѡ hypereth����
   - ����� N ����Ĭ�� 100����
   - ����������`timestamp > lastTimestamp` �� `fillId` δ���֡�
4. ���������ɽ�������ַ���鹹���ʼ����ģ�����һ���ʼ���������������
5. ����״̬��
   - `lastTimestamp` ��Ϊ�õ�ַ���³ɽ�ʱ�����
   - `seenIds` �ϲ�ȥ�ز��ضϱ����� 200 ����
6. �� `hyperdash.json` д�� `.data/` �������й������ύ��

## ʧ����߽紦��

- �ӿ�ʧ�ܣ����� 3 �Σ�ָ���˱ܣ�2s/4s/6s����
- ��ӦΪ�ջ����ʧ�ܣ������õ�ַ����¼��־��
- �ʼ�����ʧ�ܣ���ӡ���󵫲��ع�״̬���´��Ի��ٴγ��Է����������֣���

## ��������

- �۸�澯��`RESEND_API_KEY`, `EMAIL_TO`, `EMAIL_FROM`, `SYMBOLS`��
- �ɽ�������
  - `HYPERDASH_ADDRESSES`����ѡ��CSV����Ĭ������������ַ��
  - `HYPERDASH_PROVIDER`����ѡ��`hyperliquid`|`hypereth`��Ĭ�� `hyperliquid`����
  - `HYPERETH_API_KEY`����ѡ������ provider=hypereth ʱ��Ҫ����

## ��������̱�

1) ���� `src/hyperdash.js` �ͻ��ˣ������У�
2) ���� `src/hyperdash_state.js` �־û�
3) ��չ `src/notifier.js`�������ɽ��ʼ�
4) ������ `src/index.js` ������
5) ���� `test-hyperdash.js` �ű��� README �ĵ�


