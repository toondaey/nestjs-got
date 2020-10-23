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
    <a href="https://www.npmjs.com/package/@t00nday/nestjs-got" target="_blank" rel="noopener noreferrer"><img alt="synk vulnerabilities" src="https://img.shields.io/snyk/vulnerabilities/npm/@t00nday/nestjs-got"></a>
</p>

<details>
<summary><strong>Table of content</strong> (click to expand)</summary>

<!-- toc -->

-   [Installation](#installation)
-   [Usage](#usage)
-   [Configuration](#configuration)
-   [API Methods](#api-methods)
    <!-- toc -->
    -   [HTTP](#http)
    -   [Pagination](#pagination)
    -   [Stream](#stream)
        <!-- tocstop -->
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

### HTTP

The module currently only exposes the basic JSON HTTP verbs, as well as the pagination methods through the `GotService`.

For all JSON HTTP verbs - `get`, `head`, `post`, `put`, `patch` and `delete` - which are also the exposed methods, below is the the method signature where `method: string` **MUST** be any of their corresponding verbs.

```ts
// This is just used to explain the methods as this code doesn't exist in the package
import { Observable } from 'rxjs';
import { Response, OptionsOfJSONResponseBody } from 'got';

interface GotInterface {
    // prettier-ignore
    [method: string]: ( // i.e. 'get', 'head', 'post', 'put' or 'delete' method
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
    ) => Observable<Response<T>>;;
}
```

### Pagination

For all pagination methods - `each` and `all`, below is the method signature each of them.

```ts
// This is just used to explain the methods as this code doesn't exist in the package
import { Observable } from 'rxjs';
import { Response, OptionsOfJSONResponseBody } from 'got';

interface PaginateInterface {
    [method: string]: <T = any, R = unknown>( // i.e 'all' or 'each' method
        url: string | URL,
        options?: OptionsWithPagination<T, R>,
    ) => Observable<T | T[]>;
}
```

Usage examples:

```ts
@Controller()
export class ExampleController {
    constructor(private readonly gotService: GotService) {}

    controllerMethod() {
        // ...
        this.gotService.pagination.all<T>(someUrl, withOptions); // Returns Observable<T[]>
        // or
        this.gotService.pagination.each<T>(someUrl, withOptions); // Returns Observable<T>
        // ...
    }
}
```

For more information of the usage pattern, please check [here](https://www.npmjs.com/package/got#pagination-1)

### Stream

The stream feature is divided into two parts. This is because (and as stated in the documentation [here](https://www.npmjs.com/package/got#streams)), while the stream request is actually a `stream.Duplex` the _GET_ and _HEAD_ requests return a `stream.Readable` and the _POST_, _PUT_, _PATCH_ and _DELETE_ requests return a `stream.Writable`.

This prompted an implementation that attempts to cover both scenarios. The difference is only present in the arguments acceptable by the respective methods.

Further, all methods of the stream property return a stream request to which we can chain an `on<T>(eventType)` method which in turn returns a [fromEvent](https://rxjs-dev.firebaseapp.com/api/index/function/fromEvent) observable. This affords us the ability to _subscribe_ to events we wish to listen for from the request.

Possible `eventType`s include (and quite constrained to those provided by the **got** package):

-   end

-   data

-   error

-   request

-   readable

-   response

-   redirect

-   uploadProgress

-   downloadProgress

For _GET_ and _HEAD_ stream requests, below is the method signature:

```ts
// This is just used to explain the methods as this code doesn't exist in the package
import { Observable } from 'rxjs';
import { StreamOptions } from 'got';
import { StreamRequest } from '@toonday/nestjs-got/dist/stream.request';

interface StreamInterface {
    [method: string]: <T = unknown>(
        url: string | URL,
        options?: StreamOptions,
    ): StreamRequest;
}
```

while that of the _POST_, _PUT_, _PATCH_ and _DELETE_ is:

```ts
// This is just used to explain the methods as this code doesn't exist in the package
import { Observable } from 'rxjs';
import { StreamOptions } from 'got';
import { StreamRequest } from '@toonday/nestjs-got/dist/stream.request';

interface StreamInterface {
    [method: string]: <T = unknown>(
        url: string | URL,
        filePathOrStream?: string | Readable, // This is relative to 'process.cwd()'
        options?: StreamOptions,
    ): StreamRequest<T>;
}
```

Usage examples:

```ts
@Controller()
export class ExampleController {
    constructor(private readonly gotService: GotService) {}

    controllerMethod() {
        // ...
        this
            .gotService
            .stream
            .get(someUrl, streamOptions)
            .on<T>(eventType)
            .subscribe(subscribeFunction: Function); // Returns Observable<T>
        // or
        this
            .gotService
            .stream
            .head(someUrl, streamOptions)
            .on<T>(eventType)
            .subscribe(subscribeFunction: Function); // Returns Observable<T>
        // or
        this
            .gotService
            .stream
            .post(someUrl, filePathOrStream, streamOptions)
            .on<T>(eventType)
            .subscribe(subscribeFunction: Function); // Returns Observable<T>
        // or
        this
            .gotService
            .stream
            .put(someUrl, filePathOrStream, streamOptions)
            .on<T>(eventType)
            .subscribe(subscribeFunction: Function); // Returns Observable<T>
        // or
        this
            .gotService
            .stream
            .patch(someUrl, filePathOrStream, streamOptions)
            .on<T>(eventType)
            .subscribe(subscribeFunction: Function); // Returns Observable<T>
        // or
        this
            .gotService
            .stream
            .delete(someUrl, filePathOrStream, streamOptions)
            .on<T>(eventType)
            .subscribe(subscribeFunction: Function); // Returns Observable<T>
        // ...
    }
}
```

## Contributing

Contributions are welcome. However, please read the contribution's [guide](./CONTRIBUTING.md).
