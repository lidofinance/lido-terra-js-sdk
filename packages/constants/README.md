# Constants

Constants for Lido Terra Finance projects.
Part of [Lido JS SDK](https://github.com/lidofinance/lido-terra-js-sdk/#readme)

- [Install](#install)
- [Assets](#assets)
- [Chains](#chains)
- [Denoms](#denoms)
- [Hubs](#hubs)
- [Networks](#networks)

## Install

```bash
yarn add @lido-terra-sdk/constants
```

## Assets

[Source](src/asset.ts)

```ts
import { ASSET } from '@lido-terra-sdk/constants';

console.log(ASSET.BLUNA, ASSET.STLUNA);
```

## Network

[Source](src/network.ts)

```ts
import { NETWORK, NETWORK_URL } from '@lido-terra-sdk/constants';

console.log(NETWORK.MAINNET, NETWORK_URL.MAINNET);
```

## Chains

[Source](src/chain.ts)

```ts
import { CHAIN, NETWORK } from '@lido-terra-sdk/constants';

console.log(CHAINS[NETWORK.MAINNET].COLUMBUS4);
```

## Denoms

[Source](src/denom.ts)

```ts
import { DENOM, FULL_COIN } from '@lido-terra-sdk/constants';

console.log(DENOM.uluna, FULL_COIN.LUNA);
```

## Hubs

[Source](src/hub.ts)

```ts
import { NETWORK, HUB } from '@lido-terra-sdk/constants';

console.log(HUB[NETWORK.MAINNET]);
```
