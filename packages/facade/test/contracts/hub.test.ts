import {
  AccAddress,
  Dec,
  Int,
  LCDClient,
  MnemonicKey,
} from '@terra-money/terra.js';
import { CHAIN, NETWORK, NETWORK_URL } from '@lido-terra-sdk/constants';
import { LidoTerraHub } from '../../src/contracts/hub';
import { LidoTerraAddressProvider } from '../../src/addressProvider';

describe('Facade / Integration / LidoTerraHub', () => {
  let lcd: LCDClient;
  let contract: LidoTerraHub;
  let address: AccAddress;
  beforeAll(async () => {
    const key = new MnemonicKey();
    address = key.accAddress;
    lcd = new LCDClient({
      URL: NETWORK_URL[NETWORK.TESTNET],
      chainID: CHAIN[NETWORK.TESTNET].BOMBAY12,
    });
    const addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);
    contract = new LidoTerraHub(NETWORK.TESTNET, lcd, addressProvider);
  });

  test('construct with empty addressProvider', () => {
    const instance = new LidoTerraHub(NETWORK.TESTNET, lcd);
    expect(instance).toBeInstanceOf(LidoTerraHub);
  });

  test('get contract info', async () => {
    const info = await contract.getContractInfo();
    expect(info.address).toBeDefined();
    expect(Number.isFinite(info.code_id)).toBeTruthy();
    expect(info.creator).toBeDefined();
    expect(info.init_msg).toBeDefined();
  });

  test('get config', async () => {
    const config = await contract.getConfig();
    expect(AccAddress.validate(config.owner)).toBeTruthy();
    expect(AccAddress.validate(config.rewardDispatcherContract)).toBeTruthy();
    expect(AccAddress.validate(config.validatorsRegistryContract)).toBeTruthy();
    expect(AccAddress.validate(config.blunaTokenContract)).toBeTruthy();
    expect(AccAddress.validate(config.stlunaTokenContract)).toBeTruthy();
    expect(
      config.airdropRegistryContract === null ||
        AccAddress.validate(config.airdropRegistryContract),
    ).toBeTruthy();
  });

  test('get state', async () => {
    const state = await contract.getState();
    expect(state.blunaExchangeRate).toBeInstanceOf(Dec);
    expect(state.stlunaExchangeRate).toBeInstanceOf(Dec);
    expect(state.prevHubBalance).toBeInstanceOf(Int);
    expect(state.totalBondBlunaAmount).toBeInstanceOf(Int);
    expect(state.totalBondStlunaAmount).toBeInstanceOf(Int);
    expect(state.lastUnbondedTime).toBeInstanceOf(Date);
    expect(state.lastIndexModification).toBeInstanceOf(Date);
    expect(state.lastProcessedBatch).toBeGreaterThan(0);
  });

  test('get current batch', async () => {
    const currentBatch = await contract.getCurrentBatch();
    expect(currentBatch.id).toBeGreaterThan(0);
    expect(currentBatch.requestedBlunaWithFee).toBeInstanceOf(Int);
    expect(currentBatch.requestedStluna).toBeInstanceOf(Int);
  });

  test('get withdrawable unbonded', async () => {
    const out = await contract.getWithdrawableUnbonded(
      'terra1ahslh7784ga88tv7sreat8rnaun0lys06er2cd',
    );
    expect(out.withdrawable).toBeInstanceOf(Int);
  });

  test('get all history', async () => {
    const out = await contract.getAllHistory();
    expect(out.length > 0).toBeTruthy();
    const [record] = out;
    expect(record.batchId).toBeGreaterThan(0);
    expect(record.time).toBeInstanceOf(Date);
    expect(record.blunaAmount).toBeInstanceOf(Int);
    expect(record.blunaAppliedExchangeRate).toBeInstanceOf(Dec);
    expect(record.blunaWithdrawRate).toBeInstanceOf(Dec);
    expect(record.stlunaAmount).toBeInstanceOf(Int);
    expect(record.stlunaAppliedExchangeRate).toBeInstanceOf(Dec);
    expect(record.stlunaWithdrawRate).toBeInstanceOf(Dec);
    expect(typeof record.released === 'boolean').toBeTruthy();
  });

  test('get all history with limit', async () => {
    const out = await contract.getAllHistory({ limit: 1 });
    expect(out.length).toEqual(1);
  });

  test('get all history with negative limit', async () => {
    await expect(contract.getAllHistory({ limit: -1 })).rejects.toEqual(
      Error('Assert condition failed: Limit must be positive'),
    );
  });

  test('get all history with negative startFrom', async () => {
    await expect(contract.getAllHistory({ startFrom: -1 })).rejects.toEqual(
      Error('Assert condition failed: startFrom must be positive'),
    );
  });

  test('get all history with startFrom', async () => {
    const out = await contract.getAllHistory({ limit: 1, startFrom: 1 });
    expect(out.length).toEqual(1);
  });

  test('get parameters', async () => {
    const out = await contract.getParameters();
    expect(out.epochPeriod).toBeGreaterThan(0);
    expect(out.underlyingCoinDenom).toEqual('uluna');
    expect(out.unbondingPeriod).toBeGreaterThan(0);
    expect(out.pegRecoveryFee).toBeInstanceOf(Dec);
    expect(out.erThreshold).toBeInstanceOf(Dec);
    expect(out.rewardDenom).toEqual('uusd');
  });

  test('get unbond requests', async () => {
    const out = await contract.getUnbondRequests(address);
    expect(out.address).toEqual(address);
    expect(Array.isArray(out.requests)).toBeTruthy();
  });
});

describe('Facade / Unit / LidoTerraHub', () => {
  let lcd: LCDClient;
  let address: AccAddress;
  const queryMock = jest.fn();
  let contract: LidoTerraHub;
  beforeAll(() => {
    const key = new MnemonicKey();
    const addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);
    address = key.accAddress;
    lcd = {
      wasm: { contractQuery: queryMock },
    } as unknown as LCDClient;
    contract = new LidoTerraHub(NETWORK.TESTNET, lcd, addressProvider);
  });

  test('get unbond requests with data', async () => {
    queryMock.mockResolvedValueOnce({
      address,
      requests: [[1, '2', '3']],
    });
    const out = await contract.getUnbondRequests(address);
    expect(Array.isArray(out.requests)).toBeTruthy();
    expect(out.requests.length === 1).toBeTruthy();
    const [request] = out.requests;
    expect(request.userBatch).toEqual(1);
    expect(request.bLunaAmount).toEqual(new Int(2));
    expect(request.stLunaAmount).toEqual(new Int(3));
  });
});
