import { NETWORK } from '../src';
describe('Constants / network', () => {
  test('get networks', () => {
    expect(NETWORK.MAINNET).toBeDefined();
    expect(NETWORK.TESTNET).toBeDefined();
  });
});
