import { AccAddress, Int, LCDClient, MnemonicKey } from '@terra-money/terra.js';
import { NETWORK_URL, NETWORK, CHAIN } from '@lido-terra-sdk/constants';
import { LidoTerraBLunaToken } from '../../src/contracts';
import { LidoTerraAddressProvider } from '../../src/addressProvider';

describe('Facade / bLuna token', () => {
  let lcd: LCDClient;
  let contract: LidoTerraBLunaToken;
  let address: AccAddress;

  beforeAll(async () => {
    const key = new MnemonicKey();
    address = key.accAddress;
    lcd = new LCDClient({
      URL: NETWORK_URL[NETWORK.TESTNET],
      chainID: CHAIN[NETWORK.TESTNET].BOMBAY12,
    });
    const addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);

    contract = new LidoTerraBLunaToken(NETWORK.TESTNET, lcd, addressProvider);
  });

  test('get token info', async () => {
    const out = await contract.getBalance(address);
    expect(out.balance).toBeInstanceOf(Int);
    expect(out.balance).toEqual(new Int(0));
  });

  test('get token info', async () => {
    const out = await contract.getTokenInfo();
    expect(out.name).toEqual('Bonded Luna');
    expect(out.symbol).toEqual('BLUNA');
    expect(out.decimals).toEqual(6);
    expect(out.totalSupply).toBeInstanceOf(Int);
  });

  test('get all accounts', async () => {
    const out = await contract.getAllAcounts();
    expect(out.accounts.length).toBeGreaterThan(0);
    expect(typeof out.accounts[0] === 'string').toBeTruthy();
  });

  test('get all accounts with limit', async () => {
    const out = await contract.getAllAcounts({ limit: 1 });
    expect(out.accounts.length).toEqual(1);
  });

  test('get all accounts with startAfter', async () => {
    const first = await contract.getAllAcounts({ limit: 2 });
    const firstAccount = first.accounts[0];
    const out = await contract.getAllAcounts({
      limit: 1,
      startAfter: firstAccount,
    });
    expect(out.accounts.length).toEqual(1);
    expect(first.accounts[1] === out.accounts[0]).toBeTruthy();
  });
});
