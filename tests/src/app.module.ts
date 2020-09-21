import { Module, DynamicModule } from '@nestjs/common';

import { GotModule } from '../../lib';
import { GOT_CONFIG } from '../shared/gotConfig';
import { GotConfigService } from './got-config.service';

@Module({})
export class AppModule {
    static withRegister(): DynamicModule {
        return {
            module: AppModule,
            imports: [GotModule.register(GOT_CONFIG)],
            exports: [GotModule],
        };
    }

    static withUseFactoryRegisterAsync(): DynamicModule {
        return {
            module: AppModule,
            imports: [
                GotModule.registerAsync({
                    useFactory: () => GOT_CONFIG,
                }),
            ],
        };
    }

    static withUseClassRegisterAsync(): DynamicModule {
        return {
            module: AppModule,
            imports: [
                GotModule.registerAsync({
                    useClass: GotConfigService,
                }),
            ],
        };
    }

    static isGotInstance(value: Record<string, any>): boolean {
        return 'defaults' in value && 'options' in value.defaults;
    }
}
