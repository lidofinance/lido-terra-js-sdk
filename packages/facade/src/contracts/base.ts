import { NETWORK } from '@lido-terra-sdk/constants/src';
import { LCDClient } from '@terra-money/terra.js';
import { LidoTerraAddressProvider } from '../addressProvider';

class LidoTerraBaseContract {
  network: NETWORK;
  lcd: LCDClient;
  addressProvider: LidoTerraAddressProvider;
  constructor(
    network: NETWORK,
    lcd: LCDClient,
    addressProvider: LidoTerraAddressProvider,
  ) {
    this.network = network;
    this.lcd = lcd;
    this.addressProvider = addressProvider;
  }
  async query<T>(
    address: string,
    query: Record<string, unknown>,
    params?: Record<string, string | number | null | undefined>,
  ): Promise<T> {
    return this.lcd.wasm.contractQuery<T>(address, query, params);
  }
}
export { LidoTerraBaseContract };
