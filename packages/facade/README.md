# Facade

Contract queries and query builder for Lido Terra Finance projects.
Part of [Lido JS SDK](https://github.com/lidofinance/lido-terra-js-sdk/#readme)

- [Install](#install)
- [Address provider](#address-provider)
- [Contract queries](#contract-queries)
  - [Hub](#hub)
  - [bLuna token](#bluna-token)
  - [stLuna token](#stluna-token)
  - [Validators registry](#validators-registry)
  - [Airdrop registry](#airdrop-registry)
  - [Rewards contract](#rewards-contract)

## Install

```bash
yarn add @lido-terra-sdk/facade
```

## Address provider

```ts
import { CHAIN, NETWORK, NETWORK_URL } from '@lido-terra-sdk/constants/src';
import { LCDClient } from '@terra-money/terra.js';
import { LidoTerraAddressProvider } from '@lido-terra-sdk/facade';
const lcd = new LCDClient({
  URL: NETWORK_URL[NETWORK.TESTNET],
  chainID: CHAIN[NETWORK.TESTNET].BOMBAY12,
});

const addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);
const { hub, airdropRegistryContract } = await addressProvider.getAddresses();
```

## Contract queries

[Source](src/contracts/index.ts)

### Hub

```ts
import { CHAIN, NETWORK, NETWORK_URL } from '@lido-terra-sdk/constants/src';
import { LCDClient } from '@terra-money/terra.js';
import { LidoTerraAddressProvider } from '@lido-terra-sdk/facade';

const lcd = new LCDClient({
  URL: NETWORK_URL[NETWORK.TESTNET],
  chainID: CHAIN[NETWORK.TESTNET].BOMBAY12,
});
const addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);
const contract = new LidoTerraHub(NETWORK.TESTNET, lcd, addressProvider);
const config = await contract.getConfig();
```

### bLuna token

```ts
import { CHAIN, NETWORK, NETWORK_URL } from '@lido-terra-sdk/constants/src';
import { LCDClient } from '@terra-money/terra.js';
import {
  LidoTerraAddressProvider,
  LidoTerraBLunaToken,
} from '@lido-terra-sdk/facade';

const lcd = new LCDClient({
  URL: NETWORK_URL[NETWORK.TESTNET],
  chainID: CHAIN[NETWORK.TESTNET].BOMBAY12,
});
const addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);
const contract = new LidoTerraBLunaToken(NETWORK.TESTNET, lcd, addressProvider);
const config = await contract.getConfig();
```

### stLuna token

```ts
import { CHAIN, NETWORK, NETWORK_URL } from '@lido-terra-sdk/constants/src';
import { LCDClient } from '@terra-money/terra.js';
import {
  LidoTerraAddressProvider,
  LidoTerraStLunaToken,
} from '@lido-terra-sdk/facade';

const lcd = new LCDClient({
  URL: NETWORK_URL[NETWORK.TESTNET],
  chainID: CHAIN[NETWORK.TESTNET].BOMBAY12,
});
const addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);
const contract = new LidoTerraStLunaToken(
  NETWORK.TESTNET,
  lcd,
  addressProvider,
);
const config = await contract.getConfig();
```

### Validators registry

```ts
import { CHAIN, NETWORK, NETWORK_URL } from '@lido-terra-sdk/constants/src';
import { LCDClient } from '@terra-money/terra.js';
import {
  LidoTerraAddressProvider,
  LidoTerraValidatorsRegistry,
} from '@lido-terra-sdk/facade';

const lcd = new LCDClient({
  URL: NETWORK_URL[NETWORK.TESTNET],
  chainID: CHAIN[NETWORK.TESTNET].BOMBAY12,
});
const addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);
const contract = new LidoTerraValidatorsRegistry(
  NETWORK.TESTNET,
  lcd,
  addressProvider,
);
const config = await contract.getConfig();
```

### Rewards contract

```ts
import { CHAIN, NETWORK, NETWORK_URL } from '@lido-terra-sdk/constants/src';
import { LCDClient } from '@terra-money/terra.js';
import {
  LidoTerraAddressProvider,
  LidoTerraRewards,
} from '@lido-terra-sdk/facade';

const lcd = new LCDClient({
  URL: NETWORK_URL[NETWORK.TESTNET],
  chainID: CHAIN[NETWORK.TESTNET].BOMBAY12,
});
const addressProvider = new LidoTerraAddressProvider(NETWORK.TESTNET, lcd);
const contract = new LidoTerraRewards(NETWORK.TESTNET, lcd, addressProvider);
const config = await contract.getConfig();
```

### Airdrop registry

```ts
import { CHAIN, NETWORK, NETWORK_URL } from '@lido-terra-sdk/constants/src';
import { LCDClient } from '@terra-money/terra.js';
import {
  LidoTerraAirdropRegistry,
  LidoTerraRewards,
} from '@lido-terra-sdk/facade';

const lcd = new LCDClient({
  URL: NETWORK_URL[NETWORK.TESTNET],
  chainID: CHAIN[NETWORK.TESTNET].BOMBAY12,
});
const addressProvider = new LidoTerraAirdropRegistry(NETWORK.TESTNET, lcd);
const contract = new LidoTerraRewards(NETWORK.TESTNET, lcd, addressProvider);
const config = await contract.getConfig();
```
