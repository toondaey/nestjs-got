import { Readable } from 'stream';

import { Inject, Injectable } from '@nestjs/common';
import { Got, HTTPAlias, StreamOptions } from 'got';

import { GOT_INSTANCE } from './got.constant';
import { StreamRequest } from './stream.request';
import { AbstractService } from './abstrace.service';

@Injectable()
export class StreamService extends AbstractService {
    constructor(@Inject(GOT_INSTANCE) got: Got) {
        super(got);
    }

    get(url: string | URL, options?: StreamOptions): StreamRequest {
        return this.makeRequest('get', url, undefined, options);
    }

    head(url: string | URL, options?: StreamOptions): StreamRequest {
        return this.makeRequest('head', url, undefined, options);
    }

    delete(
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
    ): StreamRequest {
        return this.makeRequest('delete', url, filePathOrStream, options);
    }

    post(
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
    ): StreamRequest {
        return this.makeRequest('post', url, filePathOrStream, options);
    }

    patch(
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
    ): StreamRequest {
        return this.makeRequest('patch', url, filePathOrStream, options);
    }

    put(
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
    ): StreamRequest {
        return this.makeRequest('put', url, filePathOrStream, options);
    }

    private makeRequest(
        verb: Extract<HTTPAlias, 'get' | 'head'>,
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
    ): StreamRequest;
    private makeRequest(
        verb: Extract<HTTPAlias, 'post' | 'put' | 'patch' | 'delete'>,
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
    ): StreamRequest;
    private makeRequest(
        verb: HTTPAlias,
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
    ): StreamRequest {
        return StreamRequest.create(
            this.got,
            verb,
            url,
            filePathOrStream,
            options,
        );
    }
}
