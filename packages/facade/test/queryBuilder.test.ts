import {
  ASSET,
  CHAIN,
  FULL_COIN,
  NETWORK,
  NETWORK_URL,
} from '@lido-terra-sdk/constants';
import { AccAddress, LCDClient, MnemonicKey } from '@terra-money/terra.js';
import { LidoTerraAddressProvider } from '../';
import { LidoTerraQueryBuilder } from '../src/queryBuilder';

describe('Facade / queryBuilder', () => {
  let address: AccAddress;
  let hub: AccAddress;
  let blunaToken: AccAddress;
  let stlunaToken: AccAddress;
  let rewardContract: AccAddress;
  let addressProvider: LidoTerraAddressProvider;
  let querybuiler: LidoTerraQueryBuilder;

  beforeAll(async () => {
    const key = new MnemonicKey();
    address = key.accAddress;
    const lcd = new LCDClient({
      URL: NETWORK_URL[NETWORK.TESTNET],
      chainID: CHAIN.testnet.bombay12,
    });
    addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);
    const addresses = await addressProvider.getAddresses();
    hub = addresses.hub;
    rewardContract = addresses.rewardContract;
    blunaToken = addresses.blunaTokenContract;
    stlunaToken = addresses.stlunaTokenContract;
    querybuiler = new LidoTerraQueryBuilder(addressProvider);
  });

  test('bond bLuna', async () => {
    const query = await querybuiler.getBondQuery(ASSET.BLUNA, address, '10');

    expect(JSON.stringify(query)).toEqual(
      `["{\\"@type\\":\\"/terra.wasm.v1beta1.MsgExecuteContract\\",\\"coins\\":[{\\"amount\\":\\"10000000\\",\\"denom\\":\\"uluna\\"}],\\"contract\\":\\"${hub}\\",\\"execute_msg\\":{\\"bond\\":{}},\\"sender\\":\\"${address}\\"}"]`,
    );
  });

  test('bond stLuna', async () => {
    const query = await querybuiler.getBondQuery(ASSET.STLUNA, address, '10');

    expect(JSON.stringify(query)).toEqual(
      `["{\\"@type\\":\\"/terra.wasm.v1beta1.MsgExecuteContract\\",\\"coins\\":[{\\"amount\\":\\"10000000\\",\\"denom\\":\\"uluna\\"}],\\"contract\\":\\"${hub}\\",\\"execute_msg\\":{\\"bond_for_st_luna\\":{}},\\"sender\\":\\"${address}\\"}"]`,
    );
  });

  test('bond wrong asset', async () => {
    await expect(() =>
      querybuiler.getBondQuery('WRONG' as ASSET, address, '10'),
    ).rejects.toEqual(new Error('Asset is not supported'));
  });

  test('unbond bLuna', async () => {
    const query = await querybuiler.getUnbondQuery(ASSET.BLUNA, address, '10');
    expect(JSON.stringify(query)).toEqual(
      `["{\\"@type\\":\\"/terra.wasm.v1beta1.MsgExecuteContract\\",\\"coins\\":[],\\"contract\\":\\"${blunaToken}\\",\\"execute_msg\\":{\\"send\\":{\\"amount\\":\\"10000000\\",\\"contract\\":\\"${hub}\\",\\"msg\\":\\"eyJ1bmJvbmQiOnt9fQ==\\"}},\\"sender\\":\\"${address}\\"}"]`,
    );
  });

  test('unbond stLuna', async () => {
    const query = await querybuiler.getUnbondQuery(ASSET.STLUNA, address, '10');
    expect(JSON.stringify(query)).toEqual(
      `["{\\"@type\\":\\"/terra.wasm.v1beta1.MsgExecuteContract\\",\\"coins\\":[],\\"contract\\":\\"${stlunaToken}\\",\\"execute_msg\\":{\\"send\\":{\\"amount\\":\\"10000000\\",\\"contract\\":\\"${hub}\\",\\"msg\\":\\"eyJ1bmJvbmQiOnt9fQ==\\"}},\\"sender\\":\\"${address}\\"}"]`,
    );
  });

  test('unbond wrong asset', async () => {
    await expect(() =>
      querybuiler.getUnbondQuery('WRONG' as ASSET, address, '10'),
    ).rejects.toEqual(new Error('Asset is not supported'));
  });

  test('withdraw unbonded bluna', async () => {
    const query = await querybuiler.claimQuery(address, FULL_COIN.LUNA);
    expect(JSON.stringify(query)).toEqual(
      `["{\\"@type\\":\\"/terra.wasm.v1beta1.MsgExecuteContract\\",\\"coins\\":[],\\"contract\\":\\"${hub}\\",\\"execute_msg\\":{\\"withdraw_unbonded\\":{}},\\"sender\\":\\"${address}\\"}"]`,
    );
  });

  test('claim bluna rewards (in UST)', async () => {
    const query = await querybuiler.claimQuery(address, FULL_COIN.UST);
    expect(JSON.stringify(query)).toEqual(
      `["{\\"@type\\":\\"/terra.wasm.v1beta1.MsgExecuteContract\\",\\"coins\\":[],\\"contract\\":\\"${rewardContract}\\",\\"execute_msg\\":{\\"claim_rewards\\":{}},\\"sender\\":\\"${address}\\"}"]`,
    );
  });

  test('claim wrong coin', async () => {
    await expect(() =>
      querybuiler.claimQuery(address, 'WRONG' as FULL_COIN.LUNA),
    ).rejects.toEqual(
      new Error('Assert condition failed: Expected a Claimable but got WRONG'),
    );
  });

  test('convert bLuna into stLuna', async () => {
    const query = await querybuiler.convertQuery(address, ASSET.BLUNA, '10');

    expect(JSON.stringify(query)).toEqual(
      `["{\\"@type\\":\\"/terra.wasm.v1beta1.MsgExecuteContract\\",\\"coins\\":[],\\"contract\\":\\"${blunaToken}\\",\\"execute_msg\\":{\\"send\\":{\\"amount\\":\\"10000000\\",\\"contract\\":\\"${hub}\\",\\"msg\\":\\"eyJjb252ZXJ0Ijp7fX0=\\"}},\\"sender\\":\\"${address}\\"}"]`,
    );
  });

  test('convert stLuna into bLuna', async () => {
    const query = await querybuiler.convertQuery(address, ASSET.STLUNA, '10');

    expect(JSON.stringify(query)).toEqual(
      `["{\\"@type\\":\\"/terra.wasm.v1beta1.MsgExecuteContract\\",\\"coins\\":[],\\"contract\\":\\"${stlunaToken}\\",\\"execute_msg\\":{\\"send\\":{\\"amount\\":\\"10000000\\",\\"contract\\":\\"${hub}\\",\\"msg\\":\\"eyJjb252ZXJ0Ijp7fX0=\\"}},\\"sender\\":\\"${address}\\"}"]`,
    );
  });

  test('convert wrong asset', async () => {
    await expect(() =>
      querybuiler.convertQuery(address, 'WRONG' as ASSET, '10'),
    ).rejects.toEqual(new Error('Asset is not supported'));
  });
});
