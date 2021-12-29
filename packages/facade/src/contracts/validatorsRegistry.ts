import { NETWORK } from '@lido-terra-sdk/constants';
import { ContractInfo, Int, LCDClient } from '@terra-money/terra.js';
import { LidoTerraAddressProvider } from '../addressProvider';
import { LidoTerraBaseContract } from './base';

type ValidatorForDelegationResponse = {
  total_delegated: string;
  address: string;
};

export type ValidatorForDelegation = {
  totalDelegated: Int;
  address: string;
};

type ValidatorsConfigResponse = {
  owner: string;
  hub_contract: string;
};

export type ValidatorsConfig = {
  owner: string;
  hubContract: string;
};

class LidoTerraValidatorsRegistry extends LidoTerraBaseContract {
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
    const { validatorsRegistryContract } =
      await this.addressProvider.getAddresses();

    return this.lcd.wasm.contractInfo(validatorsRegistryContract);
  }

  async getValidatorsForDelegation(): Promise<ValidatorForDelegation[]> {
    const { validatorsRegistryContract } =
      await this.addressProvider.getAddresses();
    const result = await this.query<ValidatorForDelegationResponse[]>(
      validatorsRegistryContract,
      {
        get_validators_for_delegation: {},
      },
    );

    return result.map((one) => ({
      totalDelegated: new Int(one.total_delegated),
      address: one.address,
    }));
  }

  async getConfig(): Promise<ValidatorsConfig> {
    const { validatorsRegistryContract } =
      await this.addressProvider.getAddresses();
    const result = await this.query<ValidatorsConfigResponse>(
      validatorsRegistryContract,
      {
        config: {},
      },
    );

    return {
      owner: result.owner,
      hubContract: result.hub_contract,
    };
  }
}

export { LidoTerraValidatorsRegistry };
