# lux-api

## Install

```bash
npm install @luxfi/lux-api @luxfi/common
```

## Usage

```ts
import { OpenApiService } from '@luxfi/lux-api';
import { WebSignApiPlugin } from '@luxfi/lux-api/dist/plugins/web-sign.ts';

const service = new OpenApiService({
  store: {
    host: 'https://api.lux.io',
  },
  // you can also customize plugin as you requirement
  plugin: WebSignApiPlugin,
});

// init service
await service.init();

// call api
await service.getTotalBalance('0x1234');
```
