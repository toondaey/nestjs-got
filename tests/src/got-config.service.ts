import { Injectable } from '@nestjs/common';
import { GOT_CONFIG } from '../shared/gotConfig';
import { GotModuleOptionsFactory, GotModuleOptions } from '../../lib';

@Injectable()
export class GotConfigService implements GotModuleOptionsFactory {
    createGotOptions(): GotModuleOptions {
        return GOT_CONFIG;
    }
}
