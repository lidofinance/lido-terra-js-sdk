import { NETWORK } from './network';

export enum MAINNET_CHAINS {
  COLUMBUS5 = 'columbus-5',
}

export enum TESTNET_CHAINS {
  BOMBAY12 = 'bombay-12',
}

export const CHAIN: {
  [key in NETWORK]: key extends NETWORK.MAINNET
    ? typeof MAINNET_CHAINS
    : typeof TESTNET_CHAINS;
} = {
  [NETWORK.MAINNET]: MAINNET_CHAINS,
  [NETWORK.TESTNET]: TESTNET_CHAINS,
};
