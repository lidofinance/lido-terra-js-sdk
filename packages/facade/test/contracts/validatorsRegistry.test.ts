import { CHAIN, NETWORK, NETWORK_URL } from '@lido-terra-sdk/constants';
import { Int, LCDClient } from '@terra-money/terra.js';
import { LidoTerraAddressProvider } from '../../src/addressProvider';
import { LidoTerraValidatorsRegistry } from '../../src/contracts';

describe('Facade / validators registry', () => {
  let lcd: LCDClient;
  let contract: LidoTerraValidatorsRegistry;

  beforeAll(async () => {
    lcd = new LCDClient({
      URL: NETWORK_URL[NETWORK.TESTNET],
      chainID: CHAIN.testnet.bombay12,
    });
    const addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);
    contract = new LidoTerraValidatorsRegistry(
      NETWORK.TESTNET,
      lcd,
      addressProvider,
    );
  });

  test('get config', async () => {
    const response = await contract.getConfig();
    expect(response.owner.length > 0).toBeTruthy();
    expect(response.hubContract.length > 0).toBeTruthy();
  });

  test('get get validators for delegation', async () => {
    const response = await contract.getValidatorsForDelegation();
    expect(response.length > 0).toBeTruthy();
    expect(response[0].address.length > 0).toBeTruthy();
    expect(response[0].totalDelegated).toBeInstanceOf(Int);
    expect(response[0].totalDelegated.toNumber() > 0).toBeTruthy();
  });
});
