## Nestjs Got

This is a simple nestjs module that exposes the [got](https://www.npmjs.com/package/got) http package by exporting the `GotService` after module registration while leveraging the Reactive Programming Pattern provided by [rxjs](https://rxjs-dev.firebaseapp.com/guide/overview).

<p align="center">
  <a href="http://nestjs.com/" target="_blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <a href="https://www.npmjs.com/package/got" target="_blank"><img src="https://raw.githubusercontent.com/sindresorhus/got/HEAD/media/logo.svg" width="280" alt="Got Logo" /></a>
</p>

<p align='center'>
    <a href="https://www.npmjs.com/package/@t00nday/nestjs-got" target='_blank'><img alt="npm" src="https://img.shields.io/npm/dm/@t00nday/nestjs-got" alt="NPM Downloads"></a>
    <a href="https://coveralls.io/github/toondaey/nestjs-got" target="_blank" rel="noopener noreferrer"><img alt="Coveralls github" src="https://img.shields.io/coveralls/github/toondaey/nestjs-got"></a>
    <a href="https://www.npmjs.com/package/@t00nday/nestjs-got" target="_blank" rel="noopener noreferrer"><img alt="npm version" src="https://img.shields.io/npm/v/@t00nday/nestjs-got?color=%234CC61E&label=NPM&logo=NPM"></a>
    <a href="https://www.npmjs.com/package/@t00nday/nestjs-got" target="_blank" rel="noopener noreferrer"><img alt="LICENCE" src="https://img.shields.io/npm/l/@t00nday/nestjs-got"></a>
    <a href="https://circleci.com/gh/toondaey/nestjs-got" target="_blank" rel="noopener noreferrer"><img alt="CircleCI build" src="https://img.shields.io/circleci/build/gh/toondaey/nestjs-got/master"></a>
    <a href="https://www.npmjs.com/package/@t00nday/nestjs-got" target="_blank" rel="noopener noreferrer"><img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/min/@t00nday/nestjs-got?color=#4CC61E"></a>
</p>

<details>
<summary><strong>Table of content</strong> (click to expand)</summary>

<!-- toc -->

-   [Installation](#installation)
-   [Usage](#usage)
-   [Configuration](#configuration)
-   [API Methods](#api-methods)
-   [ToDos](#todos)
-   [Contributing](#contributing)
    <!-- tocstop -->
    </details>

## Installation

Installation is pretty simple and straightforward as all you have to do is run the following commands depending on your package manager:

-   npm

`npm install --save @t00nday/nestjs-got got`

-   yarn

`yarn add @t00nday/nestjs-got got`

## Usage

Using this module is quite simple, you just have to register it as a dependency using any of the methods below:

This could be done synchronously using the `register()` method:

`./app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { GotModule } from '@t00nday/nestjs-got';

@Module({
    imports: [
        // ... other modules
        GotModule.register({
            prefixUrl: 'http://example.org',
            // ...
        }), // Accepts a GotModuleOptions object as a parameter
    ],
})
export class AppModule {}
```

The module could also be registered asynchronously using any of the approaches provided by the `registerAsync()` method:

Examples below:

-   Using options factory provider approach

`./app.module.ts`

```ts
// prettier-ignore
import { 
    GotModule, 
    GotModuleOptions 
} from '@t00nday/nestjs-got';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        // ... other modules
        GotModule.registerAsync({
            useFactory: (): GotModuleOptions => ({
                prefixUrl: 'https://example.org',
                // ...
            }),
        }),
    ],
})
export class AppModule {}
```

-   Using class or existing provider approach:

`./got-config.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { GotModuleOptions, GotOptionsFactory } from '@t00nday/nestjs-got';

@Injectable()
export class GotConfigService implements GotModuleOptionsFactory {
    createGotOptions(): GotModuleOptions {
        return {
            prefixUrl: 'https://example.org',
            // ...
        };
    }
}
```

The `GotConfigService` **SHOULD** implement the `GotModuleOptionsFactory`, **MUST** declare the `createGotOptions()` method and **MUST** return `GotModuleOptions` object.

`./app.module.ts`

```ts
// prettier-ignore
import { Module } from '@nestjs/common';
import { GotModule, GotModuleOptions } from '@t00nday/nestjs-got';

import { GotConfigService } from './got-config.service.ts';

@Module({
    imports: [
        // ... other modules
        GotModule.registerAsync({
            useClass: GotConfigService,
        }),
    ],
})
export class AppModule {}
```

## Configuration

The `GotModuleOptions` is an alias for the `got` package's `ExtendOptions` hence accepts the same configuration object.

## API Methods

The module currently only exposes the basic JSON HTTP verbs through the GotService i.e. `get`, `head`, `post`, `put`, `patch` and `delete`.

All these methods support the same argument inputs i.e.:

```ts
// This is just used to explain the methods as this code doesn't exist in the package
import { Observable } from 'rxjs';
immport { Response, OptionsOfJSONResponseBody } from 'got';

interface GotServiceInterface {
    [method: string]: (
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
    ) => Observable<Response<T>>;
}
```

## ToDos

As stated above, this module only support some http verbs, however, the following are still in progress:

1. Support for pagination

2. Support for a `StreamService` which is supported by the **got** package itself.

## Contributing

Contributions are welcome. However, please read the contribution's [guide](./CONTRIBUTING.md).
