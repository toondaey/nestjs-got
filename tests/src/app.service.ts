import { Injectable } from '@nestjs/common';
import { OptionsOfJSONResponseBody } from 'got';

import { GotService } from '../../lib';

@Injectable()
export class AppService {
    constructor(readonly gotService: GotService) {}

    head(url: string, options?: OptionsOfJSONResponseBody) {
        return this.gotService.head(url, options);
    }

    get(url: string, options?: OptionsOfJSONResponseBody) {
        return this.gotService.get(url, options);
    }

    post(url: string, options?: OptionsOfJSONResponseBody) {
        return this.gotService.post(url, options);
    }

    put(url: string, options?: OptionsOfJSONResponseBody) {
        return this.gotService.put(url, options);
    }

    patch(url: string, options?: OptionsOfJSONResponseBody) {
        return this.gotService.patch(url, options);
    }

    delete(url: string, options?: OptionsOfJSONResponseBody) {
        return this.gotService.delete(url, options);
    }
}
