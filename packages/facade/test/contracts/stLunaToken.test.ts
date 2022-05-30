import { CHAIN, NETWORK, NETWORK_URL } from '@lido-terra-sdk/constants';
import { AccAddress, Int, LCDClient, MnemonicKey } from '@terra-money/terra.js';
import { LidoTerraAddressProvider } from '../../src/addressProvider';
import { LidoTerraStLunaToken } from '../../src/contracts';

describe('Facade / stLuna Token', () => {
  let lcd: LCDClient;
  let contract: LidoTerraStLunaToken;
  let address: AccAddress;
  beforeAll(async () => {
    const key = new MnemonicKey();
    address = key.accAddress;
    lcd = new LCDClient({
      URL: NETWORK_URL[NETWORK.TESTNET],
      chainID: CHAIN[NETWORK.TESTNET].PISCO,
    });
    const addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);
    contract = new LidoTerraStLunaToken(NETWORK.TESTNET, lcd, addressProvider);
  });

  test('construct with empty addressProvider', () => {
    const instance = new LidoTerraStLunaToken(NETWORK.TESTNET, lcd);
    expect(instance).toBeInstanceOf(LidoTerraStLunaToken);
  });

  test('get contract info', async () => {
    const info = await contract.getContractInfo();
    expect(info.address).toBeDefined();
    expect(Number.isFinite(info.code_id)).toBeTruthy();
    expect(info.creator).toBeDefined();
    expect(info.init_msg).toBeDefined();
  });

  test('get balance', async () => {
    const response = await contract.getBalance(address);
    expect(response.balance).toBeInstanceOf(Int);
  });

  test('get token info', async () => {
    const response = await contract.getTokenInfo();
    expect(response.name).toBe('Staked Luna');
    expect(response.symbol).toBe('stLuna');
    expect(response.decimals).toBe(6);
    expect(response.totalSupply).toBeInstanceOf(Int);
  });

  test('get minter', async () => {
    const response = await contract.getMinter();
    expect(AccAddress.validate(response.minter)).toBeTruthy();
  });

  test('get all accounts', async () => {
    const response = await contract.getAllAccounts();
    expect(response.accounts.length).toBeGreaterThan(0);
    expect(AccAddress.validate(response.accounts[0])).toBeTruthy();
  });

  test('get all accounts with limit', async () => {
    const response = await contract.getAllAccounts({ limit: 1 });
    expect(response.accounts.length).toEqual(1);
  });

  test('get all accounts with startAfter', async () => {
    const first = await contract.getAllAccounts({ limit: 2 });
    const account = first.accounts[0];
    const response = await contract.getAllAccounts({
      startAfter: account,
      limit: 2,
    });
    expect(response.accounts[0]).toEqual(first.accounts[1]);
  });
});
