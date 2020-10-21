import { resolve } from 'path';
import { createReadStream } from 'fs';
import { Readable, Duplex } from 'stream';

import {
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { Got, HTTPAlias, StreamOptions } from 'got';
import { fromEvent, Observable, throwError } from 'rxjs';
import { EventListenerOptions } from 'rxjs/internal/observable/fromEvent';

import { GOT_INSTANCE } from './got.constant';
import { AbstractService } from './abstrace.service';

@Injectable()
export class StreamService extends AbstractService {
    _request?: Duplex;

    constructor(@Inject(GOT_INSTANCE) got: Got) {
        super(got);
    }

    get(url: string | URL, options?: StreamOptions): this {
        return this.makeObservable('get', url, undefined, options);
    }

    head(url: string | URL, options?: StreamOptions): this {
        return this.makeObservable('head', url, undefined, options);
    }

    delete(
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
    ): this {
        return this.makeObservable('delete', url, filePathOrStream, options);
    }

    post(
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
    ): this {
        return this.makeObservable('post', url, filePathOrStream, options);
    }

    patch(
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
    ): this {
        return this.makeObservable('patch', url, filePathOrStream, options);
    }

    put(
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
    ): this {
        return this.makeObservable('put', url, filePathOrStream, options);
    }

    on<T = unknown>(
        eventName:
            | 'end'
            | 'data'
            | 'error'
            | 'request'
            | 'readable'
            | 'response'
            | 'redirect'
            | 'uploadProgress'
            | 'downloadProgress',
        eventListenerOptions: EventListenerOptions = {},
    ): Observable<T> {
        if (!this._request) {
            return throwError(
                new InternalServerErrorException(
                    {
                        error: 'Invalid or null stream request',
                    },
                    'This error is thrown when the request could not be constructed hence, resulting in undefined or null',
                ),
            );
        }

        return fromEvent<T>(this._request, eventName, eventListenerOptions);
    }

    private makeObservable(
        verb: Extract<HTTPAlias, 'get' | 'head'>,
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
    ): this;
    private makeObservable(
        verb: Extract<HTTPAlias, 'post' | 'put' | 'patch' | 'delete'>,
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
    ): this;
    private makeObservable(
        verb: HTTPAlias,
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
    ): this {
        this._request = this.got.stream[verb](url, {
            ...this.defaults,
            ...options,
            isStream: true,
        });

        // Process requests that are not 'get' or 'head'
        if (!!~['patch', 'post', 'put', 'delete'].indexOf(verb)) {
            if (typeof filePathOrStream === 'string') {
                filePathOrStream = createReadStream(
                    resolve(process.cwd(), filePathOrStream),
                );
                filePathOrStream.on(
                    'end',
                    filePathOrStream.destroy.bind(filePathOrStream),
                );
            }

            if (filePathOrStream instanceof Readable) {
                filePathOrStream.on(
                    'data',
                    this._request.write.bind(this._request),
                );
                filePathOrStream.on(
                    'end',
                    this._request.end.bind(this._request),
                );
            } else {
                this._request.end();
            }
        }

        this._request.on('end', () => (this._request = undefined));

        return this;
    }

    get request() {
        return this._request;
    }
}
