export enum NETWORK {
  MAINNET = 'classic',
  TESTNET = 'testnet',
}

export const NETWORK_URL: {
  [key in NETWORK]: string;
} = {
  [NETWORK.MAINNET]: 'https://columbus-lcd.terra.dev',
  [NETWORK.TESTNET]: 'https://pisco-lcd.terra.dev',
};
