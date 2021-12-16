import { LCDClient } from '@terra-money/terra.js';
import { NETWORK_URL, NETWORK, CHAIN } from '@lido-terra-sdk/constants';
import { LidoTerraBaseContract } from '../../src/contracts/base';
import { LidoTerraAddressProvider } from '../../src/addressProvider';

jest.mock('@terra-money/terra.js');
const contractQueryMock = jest.fn();

describe('Facade / LidoTerraBaseContract', () => {
  beforeAll(() => {
    (LCDClient as jest.Mock).mockImplementation(() => ({
      wasm: {
        contractQuery: contractQueryMock,
      },
    }));
  });

  test('init', () => {
    const lcd = new LCDClient({
      URL: NETWORK_URL[NETWORK.TESTNET],
      chainID: CHAIN.testnet.bombay12,
    });
    const addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);
    const contract = new LidoTerraBaseContract(
      NETWORK.TESTNET,
      lcd,
      addressProvider,
    );
    expect(contract).toBeInstanceOf(LidoTerraBaseContract);
    expect(contract.lcd).toBeDefined();
    expect(contract.addressProvider).toBeInstanceOf(LidoTerraAddressProvider);
  });

  test('query', async () => {
    const lcd = new LCDClient({
      URL: NETWORK_URL[NETWORK.TESTNET],
      chainID: CHAIN.testnet.bombay12,
    });
    const addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);
    const contract = new LidoTerraBaseContract(
      NETWORK.TESTNET,
      lcd,
      addressProvider,
    );
    await contract.query('some_address', { param: 'some' }, { param: 'one' });
    expect(contractQueryMock).toBeCalledWith(
      'some_address',
      { param: 'some' },
      { param: 'one' },
    );
  });
});
