import { NETWORK } from '../../constants/dist/esm';
import { getTerraFinderLink, TerraEntities } from '../src';

describe('Helpers / TerraFinder', () => {
  test('return link for entity', () => {
    const link = getTerraFinderLink(
      TerraEntities.Address,
      NETWORK.MAINNET,
      '0x0',
    );
    expect(link).toEqual('https://finder.terra.money/classic/address/0x0');
  });
});
