import { ASSET, FULL_COIN, DENOM } from '@lido-terra-sdk/constants';
import { toMicroString } from '@lido-terra-sdk/helpers';
import {
  AccAddress,
  Coin,
  Coins,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import assert from 'assert-ts';
import { LidoTerraAddressProvider } from '.';

type Query = Record<string, Record<string, string>>;

class LidoTerraQueryBuilder {
  private addressProvider: LidoTerraAddressProvider;
  constructor(addressProvider: LidoTerraAddressProvider) {
    this.addressProvider = addressProvider;
  }

  async getBondQuery(
    asset: ASSET,
    sender: AccAddress,
    amount: string,
  ): Promise<MsgExecuteContract[]> {
    assert(
      AccAddress.validate(sender),
      'Provided sender address seems to be invalid',
    );
    const { hub } = await this.addressProvider.getAddresses();
    let query: Query;
    switch (asset) {
      case ASSET.BLUNA:
        query = {
          bond: {},
        };
        break;
      case ASSET.STLUNA:
        query = {
          bond_for_st_luna: {},
        };
        break;
      default:
        throw new Error('Asset is not supported');
    }

    return [
      new MsgExecuteContract(
        sender,
        hub,
        query,
        new Coins([new Coin(DENOM.uluna, toMicroString(amount))]),
      ),
    ];
  }

  async getUnbondQuery(
    asset: ASSET,
    sender: AccAddress,
    amount: string,
  ): Promise<MsgExecuteContract[]> {
    const { hub, blunaTokenContract, stlunaTokenContract } =
      await this.addressProvider.getAddresses();

    let contractAddress: AccAddress;
    switch (asset) {
      case ASSET.BLUNA:
        contractAddress = blunaTokenContract;
        break;
      case ASSET.STLUNA:
        contractAddress = stlunaTokenContract;
        break;
      default:
        throw new Error('Asset is not supported');
    }

    const unbondQuery = {
      send: {
        contract: hub,
        amount: toMicroString(amount),
        msg: Buffer.from(
          JSON.stringify({
            unbond: {},
          }),
        ).toString('base64'),
      },
    };

    return [new MsgExecuteContract(sender, contractAddress, unbondQuery)];
  }

  async claimQuery(
    sender: AccAddress,
    claimable: FULL_COIN.UST | FULL_COIN.LUNA,
  ): Promise<MsgExecuteContract[]> {
    assert(
      [FULL_COIN.UST, FULL_COIN.LUNA].includes(claimable),
      `Expected a Claimable but got ${claimable}`,
    );

    const { rewardContract, hub } = await this.addressProvider.getAddresses();

    const isClaimRewards = claimable === FULL_COIN.UST;

    return [
      new MsgExecuteContract(sender, isClaimRewards ? rewardContract : hub, {
        [isClaimRewards ? 'claim_rewards' : 'withdraw_unbonded']: {},
      }),
    ];
  }

  async convertQuery(
    sender: AccAddress,
    asset: ASSET,
    amount: string,
  ): Promise<MsgExecuteContract[]> {
    const { hub, blunaTokenContract, stlunaTokenContract } =
      await this.addressProvider.getAddresses();
    let assetAddress: AccAddress;

    switch (asset) {
      case ASSET.BLUNA:
        assetAddress = blunaTokenContract;
        break;
      case ASSET.STLUNA:
        assetAddress = stlunaTokenContract;
        break;
      default:
        throw new Error('Asset is not supported');
    }

    const convertQuery = {
      send: {
        contract: hub,
        amount: toMicroString(amount),
        msg: Buffer.from(JSON.stringify({ convert: {} })).toString('base64'),
      },
    };
    return [new MsgExecuteContract(sender, assetAddress, convertQuery)];
  }
}

export { LidoTerraQueryBuilder };
