import { NETWORK } from '@lido-terra-sdk/constants/src';
import {
  AccAddress,
  ContractInfo,
  Dec,
  Denom,
  Int,
  LCDClient,
} from '@terra-money/terra.js';
import { LidoTerraBaseContract } from './base';
import assert from 'assert-ts';
import { LidoTerraAddressProvider } from '../addressProvider';

export type HubContractResponse = {
  owner: string;
  reward_dispatcher_contract: string;
  validators_registry_contract: string;
  bluna_token_contract: string;
  stluna_token_contract: string;
  airdrop_registry_contract?: string | null;
};

export type HubContract = {
  owner: AccAddress;
  rewardDispatcherContract: AccAddress;
  validatorsRegistryContract: AccAddress;
  blunaTokenContract: AccAddress;
  stlunaTokenContract: AccAddress;
  airdropRegistryContract?: AccAddress | null;
};

export type HubStateResponse = {
  bluna_exchange_rate: string;
  stluna_exchange_rate: string;
  total_bond_bluna_amount: string;
  total_bond_stluna_amount: string;
  last_index_modification: number;
  prev_hub_balance: string;
  last_unbonded_time: number;
  last_processed_batch: number;
};

export type HubState = {
  blunaExchangeRate: Dec;
  stlunaExchangeRate: Dec;
  totalBondBlunaAmount: Int;
  totalBondStlunaAmount: Int;
  lastIndexModification: Date;
  prevHubBalance: Int;
  lastUnbondedTime: Date;
  lastProcessedBatch: number;
};

export type HubCurrentBatchResponse = {
  id: number;
  requested_bluna_with_fee: string;
  requested_stluna: string;
};

export type HubCurrentBatch = {
  id: number;
  requestedBlunaWithFee: Int;
  requestedStluna: Int;
};

export type HubWithdrawableUnbondedResponse = {
  withdrawable_unbonded: string;
};

export type HubWithdrawableUnbonded = {
  withdrawableUnbonded: Int;
};

export type HubAllHistoryResponse = {
  history: {
    batch_id: number;
    time: number;
    bluna_amount: string;
    bluna_applied_exchange_rate: string;
    bluna_withdraw_rate: string;
    stluna_amount: string;
    stluna_applied_exchange_rate: string;
    stluna_withdraw_rate: string;
    released: boolean;
  }[];
};

export type HubAllHistory = {
  batchId: number;
  time: Date;
  blunaAmount: Int;
  blunaAppliedExchangeRate: Dec;
  blunaWithdrawRate: Dec;
  stlunaAmount: Int;
  stlunaAppliedExchangeRate: Dec;
  stlunaWithdrawRate: Dec;
  released: boolean;
}[];

export type HubParametersResponse = {
  epoch_period: number;
  underlying_coin_denom: string;
  unbonding_period: number;
  peg_recovery_fee: string;
  er_threshold: string;
  reward_denom: string;
};

export type HubParameters = {
  epochPeriod: number;
  underlyingCoinDenom: Denom;
  unbondingPeriod: number;
  pegRecoveryFee: Dec;
  erThreshold: Dec;
  rewardDenom: Denom;
};

export type HubUnboundRequestResponse = {
  address: string;
  requests: [number, string, string][];
};

export type HubUnboundRequest = {
  address: AccAddress;
  requests: {
    userBatch: number;
    bLunaAmount: Int;
    stLunaAmount: Int;
  }[];
};
class LidoTerraHub extends LidoTerraBaseContract {
  constructor(
    network: NETWORK,
    lcd: LCDClient,
    addressProvider?: LidoTerraAddressProvider,
  ) {
    super(
      network,
      lcd,
      addressProvider || new LidoTerraAddressProvider(network, lcd),
    );
  }

  async getContractInfo(): Promise<ContractInfo> {
    const { hub } = await this.addressProvider.getAddresses();

    return this.lcd.wasm.contractInfo(hub);
  }

  async getConfig(): Promise<HubContract> {
    const { hub } = await this.addressProvider.getAddresses();
    const response = await this.query<HubContractResponse>(hub, {
      config: {},
    });
    return {
      owner: response.owner,
      rewardDispatcherContract: response.reward_dispatcher_contract,
      validatorsRegistryContract: response.validators_registry_contract,
      blunaTokenContract: response.bluna_token_contract,
      stlunaTokenContract: response.stluna_token_contract,
      airdropRegistryContract: response.airdrop_registry_contract,
    };
  }

  async getState(): Promise<HubState> {
    const { hub } = await this.addressProvider.getAddresses();
    const response = await this.query<HubStateResponse>(hub, {
      state: {},
    });
    return {
      blunaExchangeRate: new Dec(response.bluna_exchange_rate),
      stlunaExchangeRate: new Dec(response.stluna_exchange_rate),
      totalBondBlunaAmount: new Int(response.total_bond_bluna_amount),
      totalBondStlunaAmount: new Int(response.total_bond_stluna_amount),
      lastIndexModification: new Date(response.last_index_modification * 1000),
      prevHubBalance: new Int(response.prev_hub_balance),
      lastUnbondedTime: new Date(response.last_unbonded_time * 1000),
      lastProcessedBatch: response.last_processed_batch,
    };
  }

  async getCurrentBatch(): Promise<HubCurrentBatch> {
    const { hub } = await this.addressProvider.getAddresses();
    const response = await this.query<HubCurrentBatchResponse>(hub, {
      current_batch: {},
    });
    return {
      id: response.id,
      requestedBlunaWithFee: new Int(response.requested_bluna_with_fee),
      requestedStluna: new Int(response.requested_stluna),
    };
  }

  async getParameters(): Promise<HubParameters> {
    const { hub } = await this.addressProvider.getAddresses();
    const response = await this.query<HubParametersResponse>(hub, {
      parameters: {},
    });
    return {
      epochPeriod: response.epoch_period,
      underlyingCoinDenom: response.underlying_coin_denom,
      unbondingPeriod: response.unbonding_period,
      pegRecoveryFee: new Dec(response.peg_recovery_fee),
      erThreshold: new Dec(response.er_threshold),
      rewardDenom: response.reward_denom,
    };
  }

  async getUnbondRequests(address: AccAddress): Promise<HubUnboundRequest> {
    assert(
      AccAddress.validate(address),
      'Provided address seems to be invalid',
    );
    const { hub } = await this.addressProvider.getAddresses();
    const response = await this.query<HubUnboundRequestResponse>(hub, {
      unbond_requests: {
        address,
      },
    });
    return {
      address: response.address,
      requests: response.requests.map((request) => ({
        userBatch: request[0],
        bLunaAmount: new Int(request[1]),
        stLunaAmount: new Int(request[2]),
      })),
    };
  }

  async getWithdrawableUnbonded(
    address: AccAddress,
  ): Promise<HubWithdrawableUnbonded> {
    assert(
      AccAddress.validate(address),
      'Provided address seems to be invalid',
    );
    const { hub } = await this.addressProvider.getAddresses();
    const response = await this.query<HubWithdrawableUnbondedResponse>(hub, {
      withdrawable_unbonded: { address },
    });
    return {
      withdrawableUnbonded: new Int(response.withdrawable_unbonded),
    };
  }

  async getAllHistory({
    limit,
    startFrom,
  }: {
    limit?: number;
    startFrom?: number;
  } = {}): Promise<HubAllHistory> {
    if (limit !== undefined) {
      assert(Number.isFinite(limit), 'Limit must be a Number');
      assert(limit <= 100, 'Limit must be less or equal 100');
      assert(limit > 0, 'Limit must be positive');
    }

    if (startFrom !== undefined) {
      assert(Number.isFinite(startFrom), 'startFrom must be a Number');
      assert(startFrom > 0, 'startFrom must be positive');
    }
    const { hub } = await this.addressProvider.getAddresses();
    const response = await this.query<HubAllHistoryResponse>(hub, {
      all_history: {
        limit: limit,
        start_from: startFrom,
      },
    });
    return response.history.map((record) => ({
      batchId: record.batch_id,
      time: new Date(record.time * 1000),
      blunaAmount: new Int(record.bluna_amount),
      blunaAppliedExchangeRate: new Dec(record.bluna_applied_exchange_rate),
      blunaWithdrawRate: new Dec(record.bluna_withdraw_rate),
      stlunaAmount: new Int(record.stluna_amount),
      stlunaAppliedExchangeRate: new Dec(record.stluna_applied_exchange_rate),
      stlunaWithdrawRate: new Dec(record.stluna_withdraw_rate),
      released: record.released,
    }));
  }
}

export { LidoTerraHub };
