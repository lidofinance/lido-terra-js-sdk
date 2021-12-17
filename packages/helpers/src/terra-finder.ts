import { NETWORK } from '@lido-terra-sdk/constants';

export enum TerraEntities {
  Tx = 'tx',
  Address = 'address',
  Block = 'block',
}

export const getTerraFinderLink = (
  entity: TerraEntities,
  network: NETWORK,
  id: string,
): string => {
  return `https://finder.terra.money/${network}/${entity}/${id}`;
};
