import { CHAIN, NETWORK, NETWORK_URL } from '@lido-terra-sdk/constants';
import { AccAddress, Dec, LCDClient } from '@terra-money/terra.js';
import { LidoTerraAddressProvider } from '../../src/addressProvider';
import { LidoTerraAirdropRegistry } from '../../src/contracts';
class EmptyAddressProvider {
  getAddresses() {
    return {};
  }
}

describe('Facade / integration / airdrop registry', () => {
  let lcd: LCDClient;
  let contract: LidoTerraAirdropRegistry;

  beforeAll(async () => {
    lcd = new LCDClient({
      URL: NETWORK_URL[NETWORK.TESTNET],
      chainID: CHAIN[NETWORK.TESTNET].PISCO,
    });
    const addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);
    contract = new LidoTerraAirdropRegistry(
      NETWORK.TESTNET,
      lcd,
      addressProvider,
    );
  });

  test('construct with empty addressProvider', () => {
    const instance = new LidoTerraAirdropRegistry(NETWORK.TESTNET, lcd);
    expect(instance).toBeInstanceOf(LidoTerraAirdropRegistry);
  });

  test('get contract info', async () => {
    const info = await contract.getContractInfo();
    expect(info.address).toBeDefined();
    expect(Number.isFinite(info.code_id)).toBeTruthy();
    expect(info.creator).toBeDefined();
    expect(info.init_msg).toBeDefined();
  });

  test('get contract info with empty contract address', async () => {
    const instance = new LidoTerraAirdropRegistry(
      NETWORK.TESTNET,
      lcd,
      new EmptyAddressProvider() as LidoTerraAddressProvider,
    );
    await expect(instance.getContractInfo()).rejects.toThrow(
      'AirdropRegistry contract not found',
    );
  });

  test('get config', async () => {
    const response = await contract.getConfig();
    expect(AccAddress.validate(response.owner)).toBeTruthy();
    expect(AccAddress.validate(response.hubContract)).toBeTruthy();
    expect(AccAddress.validate(response.rewardContract)).toBeTruthy();
    expect(response.airdropTokens).toHaveLength(2);
  });

  test('get config with empty contract address', async () => {
    const instance = new LidoTerraAirdropRegistry(
      NETWORK.TESTNET,
      lcd,
      new EmptyAddressProvider() as LidoTerraAddressProvider,
    );
    await expect(instance.getConfig()).rejects.toThrow(
      'AirdropRegistry contract not found',
    );
  });

  test('get airdrop info', async () => {
    const response = await contract.getAirdropInfo();
    expect(response.airdropInfo).toHaveLength(2);
    expect(response.airdropInfo[0].airdropToken).toBeDefined();
    expect(
      AccAddress.validate(response.airdropInfo[0].info.airdropContract),
    ).toBeTruthy();
    expect(
      AccAddress.validate(response.airdropInfo[0].info.airdropSwapContract),
    ).toBeTruthy();
    expect(
      AccAddress.validate(response.airdropInfo[0].info.airdropTokenContract),
    ).toBeTruthy();
    expect(
      response.airdropInfo[0].info.swapBeliefPrice instanceof Dec ||
        response.airdropInfo[0].info.swapBeliefPrice === null,
    ).toBeTruthy();
    expect(
      response.airdropInfo[0].info.swapMaxSpread instanceof Dec ||
        response.airdropInfo[0].info.swapMaxSpread === null,
    ).toBeTruthy();
  });

  test('get airdropInfo with empty contract address', async () => {
    const instance = new LidoTerraAirdropRegistry(
      NETWORK.TESTNET,
      lcd,
      new EmptyAddressProvider() as LidoTerraAddressProvider,
    );
    await expect(instance.getAirdropInfo()).rejects.toThrow(
      'AirdropRegistry contract not found',
    );
  });
});

describe('Facade / unit / airdrop registry', () => {
  const queryMock = jest.fn();
  let lcd: LCDClient;
  let contract: LidoTerraAirdropRegistry;
  beforeAll(() => {
    lcd = {
      wasm: {
        contractQuery: queryMock,
      },
    } as unknown as LCDClient;
    const addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);
    contract = new LidoTerraAirdropRegistry(
      NETWORK.TESTNET,
      lcd,
      addressProvider,
    );
  });

  test('dec valued for spread and price', async () => {
    queryMock.mockResolvedValueOnce({
      airdrop_info: [
        {
          airdrop_token: 'some_airdrop_token',
          info: {
            airdrop_contract: 'some_airdrop_contract',
            airdrop_swap_address: 'some_airdrop_swap_address',
            airdrop_token_contract: 'some_airdrop_token_contract',
            swap_belief_price: '1.2',
            swap_max_spread: '1.3',
          },
        },
      ],
    });
    const response = await contract.getAirdropInfo();
    expect(
      response.airdropInfo[0].info.swapBeliefPrice instanceof Dec,
    ).toBeTruthy();
    expect(
      response.airdropInfo[0].info.swapMaxSpread instanceof Dec,
    ).toBeTruthy();
  });
});
