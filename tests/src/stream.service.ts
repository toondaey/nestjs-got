import { join } from 'path';

import { StreamOptions } from 'got';
import { Injectable } from '@nestjs/common';

import { GotService } from '../../lib';

@Injectable()
export class StreamTestService {
    constructor(private readonly gotService: GotService) {}

    head(url: string, options?: StreamOptions) {
        return this.gotService.stream.head(url, options);
    }

    get(url: string, options?: StreamOptions) {
        return this.gotService.stream.get(url, options);
    }

    delete(url: string, options?: StreamOptions) {
        return this.gotService.stream.delete(url, options);
    }

    post(url: string, options?: StreamOptions) {
        return this.gotService.stream.post(
            url,
            join('tests', 'src', 'utils', 'test.txt'),
            options,
        );
    }

    put(url: string, options?: StreamOptions) {
        return this.gotService.stream.put(
            url,
            join('tests', 'src', 'utils', 'test.txt'),
            options,
        );
    }

    patch(url: string, options?: StreamOptions) {
        return this.gotService.stream.patch(
            url,
            join('tests', 'src', 'utils', 'test.txt'),
            options,
        );
    }
}
