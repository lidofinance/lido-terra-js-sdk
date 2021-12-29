import { NETWORK } from '@lido-terra-sdk/constants';
import {
  AccAddress,
  ContractInfo,
  Dec,
  LCDClient,
} from '@terra-money/terra.js';
import { LidoTerraAddressProvider } from '../addressProvider';
import { LidoTerraBaseContract } from './base';

export type AirdropRegistryConfig = {
  owner: string;
  hubContract: string;
  rewardContract: string;
  airdropTokens: string[];
};

type AirdropRegistryConfigResponse = {
  owner: string;
  hub_contract: string;
  reward_contract: string;
  airdrop_tokens: string[];
};

type AirdropInfoResponse = {
  airdrop_info: {
    airdrop_token: string;
    info: {
      airdrop_token_contract: string;
      airdrop_contract: string;
      airdrop_swap_contract: string;
      swap_belief_price: string | null;
      swap_max_spread: string | null;
    };
  }[];
};

export type AirdropInfo = {
  airdropInfo: {
    airdropToken: string;
    info: {
      airdropTokenContract: AccAddress;
      airdropContract: AccAddress;
      airdropSwapContract: AccAddress;
      swapBeliefPrice: Dec | null;
      swapMaxSpread: Dec | null;
    };
  }[];
};

class LidoTerraAirdropRegistry extends LidoTerraBaseContract {
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
    const { airdropRegistryContract } =
      await this.addressProvider.getAddresses();

    return this.lcd.wasm.contractInfo(airdropRegistryContract);
  }

  async getConfig(): Promise<AirdropRegistryConfig> {
    const { airdropRegistryContract } =
      await this.addressProvider.getAddresses();
    const response = await this.query<AirdropRegistryConfigResponse>(
      airdropRegistryContract,
      {
        config: {},
      },
    );

    return {
      owner: response.owner,
      hubContract: response.hub_contract,
      rewardContract: response.reward_contract,
      airdropTokens: response.airdrop_tokens,
    };
  }

  async getAirdropInfo(): Promise<AirdropInfo> {
    const { airdropRegistryContract } =
      await this.addressProvider.getAddresses();
    const response = await this.query<AirdropInfoResponse>(
      airdropRegistryContract,
      {
        airdrop_info: {},
      },
    );

    return {
      airdropInfo: response.airdrop_info.map((one) => ({
        airdropToken: one.airdrop_token,
        info: {
          airdropTokenContract: one.info.airdrop_token_contract,
          airdropContract: one.info.airdrop_contract,
          airdropSwapContract: one.info.airdrop_swap_contract,
          swapBeliefPrice: one.info.swap_belief_price
            ? new Dec(one.info.swap_belief_price)
            : null,
          swapMaxSpread: one.info.swap_max_spread
            ? new Dec(one.info.swap_max_spread)
            : null,
        },
      })),
    };
  }
}

export { LidoTerraAirdropRegistry };
