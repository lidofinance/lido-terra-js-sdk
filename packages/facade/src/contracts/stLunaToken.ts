import { NETWORK } from '@lido-terra-sdk/constants';
import { AccAddress, Denom, Int, LCDClient } from '@terra-money/terra.js';
import assert from 'assert-ts';
import { LidoTerraBaseContract } from './base';
import { LidoTerraAddressProvider } from '../addressProvider';

type StLunaTokenBalanceResponse = {
  balance: string;
};

export type StLunaTokenBalance = {
  balance: Int;
};

type StLunaTokenInfoResponse = {
  decimals: number;
  name: string;
  symbol: string;
  total_supply: string;
};

export type StLunaTokenInfo = {
  name: Denom;
  decimals: number;
  symbol: string;
  totalSupply: Int;
};

type StLunaTokenMinterResponse = {
  minter: string;
};

export type StLunaTokenMinter = {
  minter: AccAddress;
};

type StLunaTokenAllAccountsResponse = {
  accounts: string[];
};

export type StLunaTokenAllAccounts = {
  accounts: AccAddress[];
};

class LidoTerraStLunaToken extends LidoTerraBaseContract {
  constructor(
    network: NETWORK,
    lcd: LCDClient,
    addressProvider: LidoTerraAddressProvider,
  ) {
    super(network, lcd, addressProvider);
  }

  async getBalance(address: AccAddress): Promise<StLunaTokenBalance> {
    const { stlunaTokenContract } = await this.addressProvider.getAddresses();
    assert(
      AccAddress.validate(address),
      'Provided address seems to be invalid',
    );
    const result = await this.query<StLunaTokenBalanceResponse>(
      stlunaTokenContract,
      {
        balance: { address },
      },
    );

    return {
      balance: new Int(result.balance),
    };
  }

  async getTokenInfo(): Promise<StLunaTokenInfo> {
    const { stlunaTokenContract } = await this.addressProvider.getAddresses();
    const result = await this.query<StLunaTokenInfoResponse>(
      stlunaTokenContract,
      { token_info: {} },
    );

    return {
      name: result.name,
      decimals: result.decimals,
      symbol: result.symbol,
      totalSupply: new Int(result.total_supply),
    };
  }

  async getMinter(): Promise<StLunaTokenMinter> {
    const { stlunaTokenContract } = await this.addressProvider.getAddresses();
    const result = await this.query<StLunaTokenMinterResponse>(
      stlunaTokenContract,
      { minter: {} },
    );
    return {
      minter: result.minter,
    };
  }

  async getAllAccounts({
    limit,
    startAfter,
  }: {
    limit?: number;
    startAfter?: string;
  } = {}): Promise<StLunaTokenAllAccounts> {
    if (limit !== undefined) {
      assert(Number.isFinite(limit), 'Limit must be a Number');
      assert(limit <= 100, 'Limit must be less or equal 100');
      assert(limit > 0, 'Limit must be positive');
    }

    if (startAfter !== undefined) {
      assert(typeof startAfter === 'string', 'startAfter must be a String');
      assert(
        AccAddress.validate(startAfter),
        'startAfter must be valid address',
      );
    }
    const { stlunaTokenContract } = await this.addressProvider.getAddresses();
    const result = await this.query<StLunaTokenAllAccountsResponse>(
      stlunaTokenContract,
      {
        all_accounts: { limit, start_after: startAfter },
      },
    );

    return result;
  }
}

export { LidoTerraStLunaToken };
