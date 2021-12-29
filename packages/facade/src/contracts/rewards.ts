import { NETWORK } from '@lido-terra-sdk/constants';
import { AccAddress, Dec, Denom, Int, LCDClient } from '@terra-money/terra.js';
import assert from 'assert-ts';
import { LidoTerraAddressProvider } from '../addressProvider';
import { LidoTerraBaseContract } from './base';

type RewardsContractResponse = {
  hub_contract: string;
  reward_denom: string;
};

export type RewardsContract = {
  hubContract: AccAddress;
  rewardDenom: Denom;
};

type RewardsStateResponse = {
  global_index: string;
  total_balance: string;
  prev_reward_balance: string;
};

export type RewardsState = {
  globalIndex: Dec;
  totalBalance: Int;
  prevRewardBalance: Int;
};

type RewardsAccuredRewardsResponse = {
  rewards: string;
};

export type RewardsAccuredRewards = {
  rewards: Int;
};

type RewardsHolderResponse = {
  address: string;
  balance: string;
  index: string;
  pending_rewards: string;
};

export type RewardsHolder = {
  address: AccAddress;
  balance: Int;
  index: Dec;
  pendingRewards: Dec;
};

type RewardsHoldersResponse = {
  holders: RewardsHolderResponse[];
};

export type RewardsHolders = {
  holders: RewardsHolder[];
};

class LidoTerraRewards extends LidoTerraBaseContract {
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

  async getConfig(): Promise<RewardsContract> {
    const { rewardContract } = await this.addressProvider.getAddresses();
    const response = await this.query<RewardsContractResponse>(rewardContract, {
      config: {},
    });
    return {
      hubContract: response.hub_contract,
      rewardDenom: response.reward_denom,
    };
  }

  async getState(): Promise<RewardsState> {
    const { rewardContract } = await this.addressProvider.getAddresses();
    const response = await this.query<RewardsStateResponse>(rewardContract, {
      state: {},
    });

    return {
      globalIndex: new Dec(response.global_index),
      totalBalance: new Int(response.total_balance),
      prevRewardBalance: new Int(response.prev_reward_balance),
    };
  }

  async getAccuredRewards(address: AccAddress): Promise<RewardsAccuredRewards> {
    assert(
      AccAddress.validate(address),
      'Provided address seems to be invalid',
    );
    const { rewardContract } = await this.addressProvider.getAddresses();
    const response = await this.query<RewardsAccuredRewardsResponse>(
      rewardContract,
      {
        accrued_rewards: {
          address,
        },
      },
    );
    return {
      rewards: new Int(response.rewards),
    };
  }

  async getHolder(address: AccAddress): Promise<RewardsHolder> {
    assert(
      AccAddress.validate(address),
      'Provided address seems to be invalid',
    );
    const { rewardContract } = await this.addressProvider.getAddresses();
    const response = await this.query<RewardsHolderResponse>(rewardContract, {
      holder: { address },
    });
    return {
      address: response.address,
      balance: new Int(response.balance),
      index: new Dec(response.index),
      pendingRewards: new Dec(response.pending_rewards),
    };
  }

  async getHolders({
    limit,
    startAfter,
  }: { limit?: number; startAfter?: string } = {}): Promise<RewardsHolders> {
    const { rewardContract } = await this.addressProvider.getAddresses();
    const response = await this.query<RewardsHoldersResponse>(rewardContract, {
      holders: {
        limit,
        start_after: startAfter,
      },
    });

    return {
      holders: response.holders.map((holder) => ({
        address: holder.address,
        balance: new Int(holder.balance),
        index: new Dec(holder.index),
        pendingRewards: new Dec(holder.pending_rewards),
      })),
    };
  }
}

export { LidoTerraRewards };
