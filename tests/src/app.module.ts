import { Module, DynamicModule } from '@nestjs/common';

import { GotModule } from '../../lib';
import { GOT_CONFIG } from '../shared/gotConfig';
import { ExistingModule } from './existing.module';
import { GotConfigService } from './got-config.service';

@Module({
    exports: [GotModule],
})
export class AppModule {
    static withRegister(): DynamicModule {
        return {
            module: AppModule,
            imports: [GotModule.register()],
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

    static withUseExistingRegisterAsync(): DynamicModule {
        return {
            module: AppModule,
            imports: [
                GotModule.registerAsync({
                    imports: [ExistingModule],
                    useExisting: GotConfigService,
                }),
            ],
        };
    }

    static isGotInstance(value: Record<string, any>): boolean {
        return 'defaults' in value && 'options' in value.defaults;
    }
}
