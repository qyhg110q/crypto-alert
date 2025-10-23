# ���ܻ��Ҳ����澯�� Hyperdash ��λ��أ�GitHub Actions + Resend��

## ��Χ��Ŀ��

- **�۸񲨶��澯**����� `BTCUSDT, ETHUSDT, BNBUSDT` �� 24 Сʱ�ǵ�����CoinGecko����
- ��ֵ�� 6% ��֮��ÿ������һ�λ����� +2%��8%��10%��12% ...����ÿ�� Asia/Shanghai 00:00 ���á�
- **��λ���**������ Hyperdash/Hyperliquid ��ָ����ַ�Ĳ�λ�仯��clearinghouseState������ͨ���ʼ�֪ͨ��
  - Ŀ���ַ��
    - `0xc2a30212a8ddac9e123944d6e29faddce994e5f2`
    - `0xb317d2bc2d3d2df5fa441b5bae0ab9d8b07283ae`
  - ������ݣ��¿��֡�ƽ�֡���λ�仯��szi/positionValue��

## ����ջ

- Node.js 20������ fetch����
- Resend �ٷ� Node SDK���ʼ�����
- Luxon ����ʱ����Asia/Shanghai����
- CoinGecko �г����ݣ�24h �ǵ���۸񣩡�
- Hyperliquid clearinghouseState API��
  - �˵㣺`https://api.hyperliquid.xyz/info`��POST��type=clearinghouseState��
  - ��Ӧ��`assetPositions[].position` ���� coin, szi, positionValue, entryPx, unrealizedPnl, liquidationPx, leverage

## �ļ��ṹ

- `src/index.js`�������̣��۸��� + ��λ��أ���
- `src/coingecko.js`��CoinGecko API �ͻ��ˡ�
- `src/hyperdash.js`��Hyperliquid clearinghouseState �ͻ��ˣ����ԡ���ʱ����һ������
- `src/hyperdash_state.js`��`.data/hyperdash.json` ״̬��д��ÿ��ַÿ���ֵĲ�λ���գ���
- `src/notifier.js`��
  - `sendNotification()`���۸���ֵ�澯��
  - `sendPositionChangeEmail()`����λ�仯�ʼ�֪ͨ������ַ�������ͣ���

## Hyperdash ��λ�������

1. �ӻ�����ȡ��ʹ��Ĭ�ϵ�ַ�б�
   - `HYPERDASH_ADDRESSES`��CSV����Ĭ��Ϊ����������ַ��
2. ��ȡ `hyperdash.json` ״̬�������������ʼ����ÿ��ַ `positions={}`����
3. ���ַ���� clearinghouseState �ӿڣ�
   - �����壺`{ type: 'clearinghouseState', user: '0x��ַ' }`
   - ���� `assetPositions[].position` ��ȡ��λ���ݡ�
4. �ȶԲ�λ�仯��
   - **�¿���**����ǰ�����г����µ� coin
   - **ƽ��**��֮ǰ�����е� coin ��ʧ
   - **��λ�仯**��szi �� positionValue �仯
5. ���б仯�������ʼ�֪ͨ������ַ�������ͣ���
6. ����״̬��
   - ����ǰ��λ����д�� `positions[coin] = { szi, positionValue, entryPx, ... }`
7. �� `hyperdash.json` д�� `.data/` �������й������ύ��

## �������

- **coin**: �ʲ�/���׶�
- **szi**: ��Լ��������=��֣���=�ղ֣�
- **positionValue**: ͷ�������ֵ
- **entryPx**: �볡����
- **unrealizedPnl**: δʵ��ӯ��
- **liquidationPx**: Ԥ��ǿƽ��
- **leverage**: { value: �ܸ˱���, type: "cross" | "isolated" }

## �仯����߼�

- **�¿���**: ֮ǰ�޸� coin��������
- **ƽ��**: ֮ǰ�и� coin��������
- **��λ�仯**:
  - `szi` �仯
  - `positionValue` �仯 > $0.01
  - `entryPx` �仯 > 0.01%

## ״̬�ļ���ʽ

```json
{
  "addresses": {
    "0xADDR": {
      "positions": {
        "BTC": {
          "szi": 0.5,
          "positionValue": 54100.00,
          "entryPx": 108200.0000,
          "unrealizedPnl": 150.00,
          "liquidationPx": 102000.0000,
          "leverage": 2.0,
          "leverageType": "cross"
        }
      }
    }
  }
}
```

## ʧ����߽紦��

- �ӿ�ʧ�ܣ����� 3 �Σ�ָ���˱ܣ�2s/4s/6s����
- ��ӦΪ�ջ��� assetPositions�������õ�ַ����¼��־��
- �ʼ�����ʧ�ܣ���ӡ���󣬵��Ը���״̬�����󱨡�
- �״����У���¼��ǰ��λ��Ϊ��׼��������֪ͨ��

## ��������

- �۸�澯��`RESEND_API_KEY`, `EMAIL_TO`, `EMAIL_FROM`, `SYMBOLS`��
- ��λ��أ�
  - `HYPERDASH_ADDRESSES`����ѡ��CSV����Ĭ������������ַ��

## ��������̱�

- [x] ���� `src/hyperdash.js` �ͻ��ˣ�getClearinghouseState��
- [x] ���� `src/hyperdash_state.js` �־û���comparePositions, updateAddressPositions��
- [x] ��չ `src/notifier.js`��������λ�仯�ʼ���sendPositionChangeEmail��
- [x] ������ `src/index.js` �����̣�monitorHyperdashPositions��
- [x] ���� `test-hyperdash.js` �ű��� HYPERDASH_README.md �ĵ�
- [x] ���ز�����֤���ܹ���ȡ��λ���ݣ�
