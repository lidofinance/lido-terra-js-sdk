import { DENOM } from '@lido-terra-sdk/constants';
import { Coin, Dec } from '@terra-money/terra.js';
import {
  coinify,
  formatCoinWithoutDenom,
  decToCoin,
  demicrofy,
  microfy,
  parseCoin,
  humanifyDec,
  toMicroString,
} from '../src/coin';

describe('Helpers / coin', () => {
  test('coinify', () => {
    const coin = coinify('10', DENOM.uluna);
    expect(coin).toBeInstanceOf(Coin);
    expect(coin.denom).toBe(DENOM.uluna);
    expect(coin.amount.toString()).toBe('10');
  });

  test('formatCoinWithoutDenom', () => {
    const coin = coinify('10000000', DENOM.uluna);
    expect(formatCoinWithoutDenom(coin)).toBe('10');
  });

  test('empty formatCoinWithoutDenom', () => {
    expect(formatCoinWithoutDenom(false as unknown as Coin)).toBe('');
  });

  test('decToCoin', () => {
    const coin = decToCoin(new Dec('10000000'), DENOM.uluna);
    expect(coin).toBeInstanceOf(Coin);
    expect(coin.denom).toBe(DENOM.uluna);
    expect(coin.amount.toString()).toBe('10000000.000000000000000000');
  });

  test('demicrofy', () => {
    const dec = demicrofy(new Dec('10000000'));
    expect(dec.toString()).toBe('10.000000000000000000');
  });

  test('microfy', () => {
    const dec = microfy(new Dec('10'));
    expect(dec.toString()).toBe('10000000.000000000000000000');
  });

  test('parseCoin', () => {
    const dec = parseCoin('10');
    expect(dec.toString()).toBe('10000000.000000000000000000');
  });

  test('humanifyDec', () => {
    const dec = new Dec('10000000');
    expect(humanifyDec(dec)).toBe('10.000000');
  });

  test('toMicroString', () => {
    const dec = new Dec('10');
    expect(toMicroString(dec)).toBe('10000000');
  });
});
