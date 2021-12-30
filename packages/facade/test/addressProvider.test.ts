import { CHAIN, NETWORK, NETWORK_URL } from '@lido-terra-sdk/constants/src';
import { LCDClient } from '@terra-money/terra.js';
import { LidoTerraAddressProvider } from '../src/addressProvider';

const contractQueryMock = jest.fn();
const contractInfoMock = jest.fn();
jest.mock('@terra-money/terra.js');

describe('Facade / AddressProvider', () => {
  let lcd: LCDClient;

  beforeAll(async () => {
    (LCDClient as jest.Mock).mockImplementation(() => ({
      wasm: {
        contractQuery: contractQueryMock,
        contractInfo: contractInfoMock,
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
    contractInfoMock.mockResolvedValueOnce({
      init_msg: {
        bluna_reward_contract: 'some_bluna_reward_contract',
      },
    });
    const addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);
    const addresses = await addressProvider.getAddresses();
    expect(addresses).toMatchObject({
      airdropRegistryContract: 'some_airdrop_registry_contract',
      rewardContract: 'some_bluna_reward_contract',
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
    contractInfoMock.mockResolvedValueOnce({
      init_msg: {
        bluna_reward_contract: 'some_bluna_reward_contract_changed',
      },
    });
    const addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);
    const addresses = await addressProvider.getAddresses();
    expect(addresses).toMatchObject({
      airdropRegistryContract: 'some_airdrop_registry_contract',
      rewardContract: 'some_bluna_reward_contract',
      hub: expect.any(String),
    });
  });
});
