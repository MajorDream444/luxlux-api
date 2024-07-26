# lux-api

## Install

```bash
npm install @luxwallet/lux-api @luxwallet/common
```

## Usage

```ts
import { OpenApiService } from '@luxwallet/lux-api';
import { WebSignApiPlugin } from '@luxwallet/lux-api/dist/plugins/web-sign.ts';

const service = new OpenApiService({
  store: {
    host: 'https://api.rabby.io',
  },
  // you can also customize plugin as you requirement
  plugin: WebSignApiPlugin,
});

// init service
await service.init();

// call api
await service.getTotalBalance('0x1234');
```
