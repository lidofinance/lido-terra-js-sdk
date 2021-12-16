export enum NETWORK {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export const NETWORK_URL: {
  [key in NETWORK]: string;
} = {
  [NETWORK.MAINNET]: 'https://lcd.terra.dev',
  [NETWORK.TESTNET]: 'https://bombay-lcd.terra.dev',
};
