import { CHAIN, NETWORK, NETWORK_URL } from '@lido-terra-sdk/constants/src';
import { LCDClient } from '@terra-money/terra.js';
import { LidoTerraAddressProvider } from '../src/addressProvider';

const contractQueryMock = jest.fn();
jest.mock('@terra-money/terra.js');

describe('Facade / AddressProvider', () => {
  let lcd: LCDClient;

  beforeAll(async () => {
    (LCDClient as jest.Mock).mockImplementation(() => ({
      wasm: {
        contractQuery: contractQueryMock,
      },
    }));
    lcd = new LCDClient({
      URL: NETWORK_URL[NETWORK.TESTNET],
      chainID: CHAIN[NETWORK.TESTNET].BOMBAY12,
    });
  });

  test('get addresses', async () => {
    contractQueryMock.mockResolvedValueOnce({
      some: 'one',
      airdrop_registry_contract: 'some_airdrop_registry_contract',
    });
    contractQueryMock.mockResolvedValueOnce({
      other: 'one',
    });
    const addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);
    const addresses = await addressProvider.getAddresses();
    expect(addresses).toEqual({
      airdropRegistryContract: 'some_airdrop_registry_contract',
      hub: expect.any(String),
    });
  });
  test('get cached', async () => {
    contractQueryMock.mockResolvedValueOnce({
      some: 'one',
      airdrop_registry_contract: 'some_airdrop_registry_contract_changed',
    });
    contractQueryMock.mockResolvedValueOnce({
      other: 'one',
    });
    const addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);
    const addresses = await addressProvider.getAddresses();
    expect(addresses).toEqual({
      airdropRegistryContract: 'some_airdrop_registry_contract',
      hub: expect.any(String),
    });
  });
});
