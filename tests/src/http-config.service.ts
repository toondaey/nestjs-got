import { Injectable } from '@nestjs/common';
import { HTTP_CONFIG } from '../shared/mailerConfig';
import { HttpModuleOptionsFactory, HttpModuleOptions } from '../../lib';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
    createHttpOptions(): HttpModuleOptions {
        return HTTP_CONFIG;
    }
}
