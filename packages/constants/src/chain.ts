import { NETWORK } from './network';

export const CHAIN: {
  [key in NETWORK]: Record<string, string>;
} = {
  [NETWORK.MAINNET]: {
    COLUMBUS4: 'columbus-4',
    COLUMBUS5: 'columbus-5',
  },
  [NETWORK.TESTNET]: {
    BOMBAY11: 'bombay-11',
    BOMBAY12: 'bombay-12',
  },
};
