import got from 'got';
import { DynamicModule, Module, Provider, Type } from '@nestjs/common';

import {
    GotModuleOptions,
    GotModuleAsyncOptions,
    GotModuleOptionsFactory,
} from './got.interface';
import { GotService } from './got.service';
import { StreamService } from './stream.service';
import { PaginationService } from './paginate.service';
import { GOT_INSTANCE, GOT_OPTIONS } from './got.constant';

@Module({
    exports: [GotService],
    providers: [GotService, PaginationService, StreamService],
})
export class GotModule {
    static register(options: GotModuleOptions = {}): DynamicModule {
        return {
            module: GotModule,
            providers: [
                { provide: GOT_OPTIONS, useValue: options },
                {
                    provide: GOT_INSTANCE,
                    useFactory: (config: GotModuleOptions) =>
                        got.extend(config),
                    inject: [GOT_OPTIONS],
                },
            ],
        };
    }

    static registerAsync(options: GotModuleAsyncOptions): DynamicModule {
        return {
            module: GotModule,
            providers: [
                ...this.createAsyncProviders(options),
                {
                    provide: GOT_INSTANCE,
                    useFactory: (config: GotModuleOptions) =>
                        got.extend(config),
                    inject: [GOT_OPTIONS],
                },
            ],
            imports: options.imports || [],
        };
    }

    static createAsyncProviders(options: GotModuleAsyncOptions): Provider[] {
        if (options.useFactory || options.useExisting) {
            return [this.createAsyncOptionsProvider(options)];
        }

        const useClass = options.useClass as Type<GotModuleOptionsFactory>;

        return [
            this.createAsyncOptionsProvider(options),
            { provide: useClass, useClass },
        ];
    }

    static createAsyncOptionsProvider(
        options: GotModuleAsyncOptions,
    ): Provider {
        if (options.useFactory) {
            return {
                provide: GOT_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        const inject = [
            (options.useClass || options.useExisting) as Type<
                GotModuleOptionsFactory
            >,
        ];

        return {
            provide: GOT_OPTIONS,
            useFactory: (factory: GotModuleOptionsFactory) =>
                factory.createGotOptions(),
            inject,
        };
    }
}
