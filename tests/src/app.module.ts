import { Module, DynamicModule } from '@nestjs/common';

import { HttpModule } from '../../lib';
import { HTTP_CONFIG } from '../shared/mailerConfig';
import { HttpConfigService } from './http-config.service';

@Module({})
export class AppModule {
    static withRegister(): DynamicModule {
        return {
            module: AppModule,
            imports: [HttpModule.register(HTTP_CONFIG)],
        };
    }

    static withUseFactoryRegisterAsync(): DynamicModule {
        return {
            module: AppModule,
            imports: [
                HttpModule.registerAsync({
                    useFactory: () => HTTP_CONFIG,
                }),
            ],
        };
    }

    static withUseClassRegisterAsync(): DynamicModule {
        return {
            module: AppModule,
            imports: [
                HttpModule.registerAsync({
                    useClass: HttpConfigService,
                }),
            ],
        };
    }

    static isGotInstance(value: Record<string, any>): boolean {
        return 'defaults' in value && 'options' in value.defaults;
    }
}
