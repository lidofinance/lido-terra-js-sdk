import { NETWORK, HUB } from '@lido-terra-sdk/constants';
import { LCDClient } from '@terra-money/terra.js';

export type HubConfigResponse = {
  owner: string;
  reward_dispatcher_contract: string;
  validators_registry_contract: string;
  bluna_token_contract: string;
  stluna_token_contract: string;
  airdrop_registry_contract: string;
};

export type AddressConfig = {
  hub: string;
  rewardContract: string;
  rewardDispatcherContract: string;
  validatorsRegistryContract: string;
  blunaTokenContract: string;
  stlunaTokenContract: string;
  airdropRegistryContract: string | null;
};

export type AirdropRegistryResponse = {
  hub_contract: string;
  reward_contract: string;
  airdrop_tokens: string[];
};

const cache: Record<NETWORK, AddressConfig | null> = {
  mainnet: null,
  testnet: null,
};

class LidoTerraAddressProvider {
  network: NETWORK;
  hub: string;
  lcd: LCDClient;
  constructor(network: NETWORK, lcd: LCDClient) {
    this.network = network;
    this.hub = HUB[network];
    this.lcd = lcd;
  }
  async getAddresses(): Promise<AddressConfig> {
    const cached = cache[this.network];

    if (cached !== null) {
      return cached;
    }

    const hubConfig = await this.lcd.wasm.contractQuery<HubConfigResponse>(
      this.hub,
      {
        config: {},
      },
    );

    const rewardDispatcherContractInfo = await this.lcd.wasm.contractInfo(
      hubConfig.reward_dispatcher_contract,
    );

    const rewardContract = rewardDispatcherContractInfo.init_msg
      .bluna_reward_contract as string;

    const out = {
      hub: this.hub,
      rewardContract: rewardContract,
      rewardDispatcherContract: hubConfig.reward_dispatcher_contract,
      validatorsRegistryContract: hubConfig.validators_registry_contract,
      blunaTokenContract: hubConfig.bluna_token_contract,
      stlunaTokenContract: hubConfig.stluna_token_contract,
      airdropRegistryContract: hubConfig.airdrop_registry_contract,
    };
    cache[this.network] = out;
    return out;
  }
}

export { LidoTerraAddressProvider };
