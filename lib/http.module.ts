import got from 'got';
import { DynamicModule, Module, Provider, Type } from '@nestjs/common';

import { HttpService } from './http.service';
import {
    HttpModuleOptions,
    HttpModuleAsyncOptions,
    HttpModuleOptionsFactory,
} from './http.interface';
import { HTTP_INSTANCE, HTTP_OPTIONS } from './http.constant';

@Module({
    providers: [HttpService],
    exports: [HttpService],
})
export class HttpModule {
    static register(options: HttpModuleOptions = {}): DynamicModule {
        return {
            module: HttpModule,
            providers: [
                { provide: HTTP_OPTIONS, useValue: options },
                {
                    provide: HTTP_INSTANCE,
                    useFactory: (config: HttpModuleOptions) =>
                        got.extend(config),
                    inject: [HTTP_OPTIONS],
                },
            ],
        };
    }

    static registerAsync(options: HttpModuleAsyncOptions): DynamicModule {
        return {
            module: HttpModule,
            providers: [
                ...this.createAsyncProviders(options),
                {
                    provide: HTTP_INSTANCE,
                    useFactory: (config: HttpModuleOptions) =>
                        got.extend(config),
                    inject: [HTTP_OPTIONS],
                },
            ],
            imports: options.imports || [],
        };
    }

    static createAsyncProviders(options: HttpModuleAsyncOptions): Provider[] {
        if (options.useFactory || options.useExisting) {
            return [this.createAsyncOptionsProvider(options)];
        }

        const useClass = options.useClass as Type<HttpModuleOptionsFactory>;

        return [
            this.createAsyncOptionsProvider(options),
            { provide: useClass, useClass },
        ];
    }

    static createAsyncOptionsProvider(
        options: HttpModuleAsyncOptions,
    ): Provider {
        if (options.useFactory) {
            return {
                provide: HTTP_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        const inject = [
            (options.useClass || options.useExisting) as Type<
                HttpModuleOptionsFactory
            >,
        ];

        return {
            provide: HTTP_OPTIONS,
            useFactory: (factory: HttpModuleOptionsFactory) =>
                factory.createHttpOptions(),
            inject,
        };
    }
}
