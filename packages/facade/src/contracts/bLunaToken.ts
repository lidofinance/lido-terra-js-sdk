import { NETWORK, DENOM } from '@lido-terra-sdk/constants';
import {
  AccAddress,
  Coin,
  Coins,
  Denom,
  Int,
  LCDClient,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import assert from 'assert-ts';
import { toMicroString } from '@lido-terra-sdk/helpers';
import { LidoTerraBaseContract } from './base';
import { LidoTerraAddressProvider } from '../addressProvider';

export type BalanceResponse = {
  balance: string;
};

export type Balance = {
  balance: Int;
};

export type BLunaTokenInfoResponse = {
  name: string;
  symbol: string;
  decimals: number;
  total_supply: string;
};

export type BLunaTokenInfo = {
  name: Denom;
  symbol: string;
  decimals: number;
  totalSupply: Int;
};

export type BLunaTokenAllAccountsResponse = {
  accounts: string[];
};

export type BLunaTokenAllAccounts = {
  accounts: AccAddress[];
};

class LidoTerraBLunaToken extends LidoTerraBaseContract {
  constructor(
    network: NETWORK,
    lcd: LCDClient,
    addressProvider: LidoTerraAddressProvider,
  ) {
    super(network, lcd, addressProvider);
  }

  async getBalance(address: AccAddress): Promise<Balance> {
    assert(
      AccAddress.validate(address),
      'Provided address seems to be invalid',
    );
    const { blunaTokenContract } = await this.addressProvider.getAddresses();
    const response = await this.query<BalanceResponse>(blunaTokenContract, {
      balance: { address },
    });
    return { balance: new Int(response.balance) };
  }

  async getTokenInfo(): Promise<BLunaTokenInfo> {
    const { blunaTokenContract } = await this.addressProvider.getAddresses();
    const response = await this.query<BLunaTokenInfoResponse>(
      blunaTokenContract,
      {
        token_info: {},
      },
    );
    return {
      name: response.name,
      symbol: response.symbol,
      decimals: response.decimals,
      totalSupply: new Int(response.total_supply),
    };
  }

  async getAllAcounts({
    limit,
    startAfter,
  }: {
    limit?: number;
    startAfter?: string;
  } = {}): Promise<BLunaTokenAllAccounts> {
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
    const { blunaTokenContract } = await this.addressProvider.getAddresses();
    const response = await this.query<BLunaTokenAllAccountsResponse>(
      blunaTokenContract,
      {
        all_accounts: {
          limit,
          start_after: startAfter,
        },
      },
    );

    return response;
  }
}

export { LidoTerraBLunaToken };
