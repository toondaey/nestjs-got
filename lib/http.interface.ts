import { ExtendOptions } from 'got';
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

export type HttpModuleOptions = ExtendOptions;

export interface HttpModuleOptionsFactory {
    createHttpOptions(): HttpModuleOptions | Promise<HttpModuleOptions>;
}

export interface HttpModuleAsyncOptions
    extends Pick<ModuleMetadata, 'imports'> {
    // prettier-ignore
    useFactory?(
        ...args: any[]
    ): HttpModuleOptions | Promise<HttpModuleOptions>;
    useClass?: Type<HttpModuleOptionsFactory>;
    useExisting?: Type<HttpModuleOptionsFactory>;
    inject?: any[];
}
