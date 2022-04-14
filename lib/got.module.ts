import got from 'got';
import { DynamicModule, Module, Provider, Type } from '@nestjs/common';

import {
    GotModuleOptions,
    GotModuleAsyncOptions,
    GotModuleOptionsFactory,
} from './got.interface';
import { GotService } from './got.service';
import { StreamService } from './stream.service';
import { StreamRequest } from './stream.request';
import { PaginationService } from './paginate.service';
import { GOT_INSTANCE_TOKEN, GOT_OPTIONS_TOKEN } from './got.constant';

@Module({
    exports: [GotService],
    providers: [
        {
            provide: GOT_INSTANCE_TOKEN,
            useValue: got,
        },
        GotService,
        StreamRequest,
        StreamService,
        PaginationService,
    ],
})
export class GotModule {
    static register(options: GotModuleOptions = {}): DynamicModule {
        return {
            module: GotModule,
            providers: [
                {
                    provide: GOT_INSTANCE_TOKEN,
                    useValue: got.extend(options),
                },
            ],
        };
    }

    static registerAsync(options: GotModuleAsyncOptions): DynamicModule {
        return {
            module: GotModule,
            providers: [
                ...GotModule.createAsyncProviders(options),
                {
                    provide: GOT_INSTANCE_TOKEN,
                    useFactory: (config: GotModuleOptions) =>
                        got.extend(config),
                    inject: [GOT_OPTIONS_TOKEN],
                },
            ],
            imports: options.imports || [],
        };
    }

    static createAsyncProviders(options: GotModuleAsyncOptions): Provider[] {
        if (options.useFactory || options.useExisting) {
            return [GotModule.createAsyncOptionsProvider(options)];
        }

        const useClass = options.useClass as Type<GotModuleOptionsFactory>;

        return [
            GotModule.createAsyncOptionsProvider(options),
            { provide: useClass, useClass },
        ];
    }

    static createAsyncOptionsProvider(
        options: GotModuleAsyncOptions,
    ): Provider {
        if (options.useFactory) {
            return {
                provide: GOT_OPTIONS_TOKEN,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        const inject = [
            (options.useClass ||
                options.useExisting) as Type<GotModuleOptionsFactory>,
        ];

        return {
            provide: GOT_OPTIONS_TOKEN,
            useFactory: (factory: GotModuleOptionsFactory) =>
                factory.createGotOptions(),
            inject,
        };
    }
}
