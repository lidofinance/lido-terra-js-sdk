import { DENOM } from '@lido-terra-sdk/constants';
import { Coin, Dec } from '@terra-money/terra.js';

const MILLION = 10 ** 6;

export const coinify = (amount: string, denom: DENOM): Coin => {
  return new Coin(denom, amount);
};

export const formatCoinWithoutDenom = (
  coin: Coin | undefined,
  decimals = 6,
): string => {
  if (!coin) return '';

  return parseFloat(
    coin
      .toDecCoin()
      .div(10 ** decimals)
      .amount.toString(),
  ).toString();
};

export const decToCoin = (dec: Dec, denom: DENOM): Coin => {
  return new Coin(denom, dec.toString());
};

export const demicrofy = (dec: Dec): Dec => dec.div(10 ** 6);

export const microfy = (dec: Dec): Dec => dec.mul(10 ** 6);

export const parseCoin = (amount: string): Dec => microfy(new Dec(amount));

export const humanifyDec = (dec: Dec): string => dec.div(MILLION).toFixed(6);

export const toMicroString = (amount: string): string =>
  microfy(new Dec(amount)).toInt().toString();
