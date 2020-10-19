import { join } from 'path';

import { StreamOptions } from 'got';
import { Injectable } from '@nestjs/common';

import { GotService } from '../../lib';

@Injectable()
export class StreamTestService {
    constructor(private readonly gotService: GotService) {}

    head(url: string, options?: StreamOptions) {
        return this.gotService.stream.head(url, options, {
            matcher: JSON.parse,
        });
    }

    get(url: string, options?: StreamOptions) {
        return this.gotService.stream.get(url, options, {
            matcher: JSON.parse,
        });
    }

    delete(url: string, options?: StreamOptions) {
        return this.gotService.stream.delete(url, undefined, options, {
            matcher: JSON.parse,
        });
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
            {
                matcher: JSON.parse,
            },
        );
    }

    patch(url: string, options?: StreamOptions) {
        return this.gotService.stream.patch(
            url,
            join('tests', 'src', 'utils', 'test.txt'),
            options,
            {
                matcher: JSON.parse,
            },
        );
    }
}
