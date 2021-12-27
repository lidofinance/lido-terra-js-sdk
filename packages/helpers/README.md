# Helpers

Usable helpers for Lido Terra Finance projects.
Part of [Lido JS SDK](https://github.com/lidofinance/lido-terra-js-sdk/#readme)

- [Install](#install)
- [Terra Finder link composer](#terra-finder-link-composer)
- [Coinify](#coinify)
- [Format Coin without denom](#format-coin-without-denom)
- [Dec to Coin](#dec-to-coin)
- [Microfy](#microfy)
- [Demicrofy](#demicrofy)
- [Parse Coin](#parse-coin)
- [Humanify Dec](#humanify-dec)
- [To Micro String](#to-micro-string)

## Install

```bash
yarn add @lido-terra-sdk/helpers
```

## Terra finder link composer

Compose terra finder link from given arguments

```ts
import { CHAIN, NETWORK } from '@lido-terra-sdk/constants';
import { TerraEntities, getTerraFinderLink } from '@lido-terra-sdk/helpers';

const link = getTerraFinderLink(
  TerraEntities.Address,
  NETWORK.MAINNET,
  'terra1mka5pnxk5jwqwpkwqj928fp5m9p3hqu2vwjqfa',
);
```

## Coinify

Create a `Coin` instance from string and denom

```ts
import { CHAIN, DENOM } from '@lido-terra-sdk/constants';
import { coinify } from '@lido-terra-sdk/helpers';

const coin = coinify('10', DENOM.uluna);
```

## Format Coin without denom

Extract amount from `Coin` instance and converts into string

```ts
import { CHAIN, DENOM } from '@lido-terra-sdk/constants';
import { formatCoinWithoutDenom } from '@lido-terra-sdk/helpers';

const coin = coinify('10000000', DENOM.uluna);
console.log(formatCoinWithoutDenom(coin)); //10
```

## Dec to Coin

Create `Coin` instance from `Dec` amount and denom

```ts
import { CHAIN, DENOM } from '@lido-terra-sdk/constants';
import { decToCoin } from '@lido-terra-sdk/helpers';
import { Dec } from '@terra-money/terra.js';

const coin = decToCoin(new Dec('10000000'), DENOM.uluna);
```

## Microfy

Multiply provided `Dec` value by 10\*\*6

```ts
import { Dec } from '@terra-money/terra.js';
import { microfy } from '@lido-terra-sdk/helpers';

const coin = microfy(new Dec('10')); //10_000_000
```

## Demicrofy

Divide provided `Dec` value by 10\*\*6

```ts
import { Dec } from '@terra-money/terra.js';
import { demicrofy } from '@lido-terra-sdk/helpers';

const coin = demicrofy(new Dec('10000000')); //10
```

## Parse coin

Convert string into `Dec` with multiplication by 10\*\*6

```ts
import { parseCoin } from '@lido-terra-sdk/helpers';

const coin = parseCoin('10'); //Dec('10000000')
```

## Humanify Dec

Convert `Dec` amount into formatted string

```ts
import { Dec } from '@terra-money/terra.js';
import { parseCoin } from '@lido-terra-sdk/helpers';

const dec = new Dec('10000000');
console.log(humanifyDec(dec)); /// '10.000000'
```

## To Micro String

Divide string amount by 10\*\*6

```ts
import { toMicroString } from '@lido-terra-sdk/helpers';

console.log(toMicroString('10')); // '10000000'
```
