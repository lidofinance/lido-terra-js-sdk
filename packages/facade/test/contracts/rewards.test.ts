import {
  AccAddress,
  Dec,
  Int,
  LCDClient,
  MnemonicKey,
} from '@terra-money/terra.js';
import { NETWORK_URL, NETWORK, CHAIN } from '@lido-terra-sdk/constants';
import { LidoTerraRewards } from '../../src/contracts';
import { LidoTerraAddressProvider } from '../../src/addressProvider';

describe('Facade / rewards', () => {
  let lcd: LCDClient;
  let contract: LidoTerraRewards;
  let address: AccAddress;
  beforeAll(async () => {
    const key = new MnemonicKey();
    address = key.accAddress;
    lcd = new LCDClient({
      URL: NETWORK_URL[NETWORK.TESTNET],
      chainID: CHAIN[NETWORK.TESTNET].BOMBAY12,
    });
    const addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);
    contract = new LidoTerraRewards(NETWORK.TESTNET, lcd, addressProvider);
  });

  test('get config', async () => {
    const result = await contract.getConfig();
    expect(result.hubContract).toBeDefined();
    expect(AccAddress.validate(result.hubContract)).toBeTruthy();
  });

  test('get state', async () => {
    const result = await contract.getState();
    expect(result.globalIndex).toBeInstanceOf(Dec);
    expect(result.totalBalance).toBeInstanceOf(Int);
    expect(result.totalBalance).toBeInstanceOf(Int);
  });

  test('get accured rewards', async () => {
    const result = await contract.getAccuredRewards(address);
    expect(result.rewards).toBeInstanceOf(Int);
  });

  test('get holder', async () => {
    const result = await contract.getHolder(address);
    expect(result.address).toEqual(address);
    expect(result.index).toBeInstanceOf(Dec);
    expect(result.balance).toBeInstanceOf(Int);
    expect(result.pendingRewards).toBeInstanceOf(Dec);
  });

  test('get holders', async () => {
    const result = await contract.getHolders();
    expect(result.holders.length).toBeGreaterThan(0);
    expect(AccAddress.validate(result.holders[0].address)).toBeTruthy();
    expect(result.holders[0].index).toBeInstanceOf(Dec);
    expect(result.holders[0].balance).toBeInstanceOf(Int);
    expect(result.holders[0].pendingRewards).toBeInstanceOf(Dec);
  });
});
