import { resolve } from 'path';
import { createReadStream } from 'fs';
import { Readable, Duplex } from 'stream';

import * as split from 'split';
import { Observable, Subscriber } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { Got, HTTPAlias, StreamOptions } from 'got';

import { GOT_INSTANCE } from './got.constant';
import { SplitOptions } from './got.interface';
import { AbstractService } from './abstrace.service';

@Injectable()
export class StreamService extends AbstractService {
    constructor(@Inject(GOT_INSTANCE) got: Got) {
        super(got);
    }

    get<T = unknown>(
        url: string | URL,
        options?: StreamOptions,
        splitOptions?: SplitOptions,
    ): Observable<T> {
        return this.makeObservable(
            'get',
            url,
            undefined,
            options,
            splitOptions,
        );
    }

    head<T = unknown>(
        url: string | URL,
        options?: StreamOptions,
        splitOptions?: SplitOptions,
    ): Observable<T> {
        return this.makeObservable(
            'head',
            url,
            undefined,
            options,
            splitOptions,
        );
    }

    delete<T = unknown>(
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
        splitOptions?: SplitOptions,
    ): Observable<T> {
        return this.makeObservable<T>(
            'delete',
            url,
            filePathOrStream,
            options,
            splitOptions,
        );
    }

    post<T = unknown>(
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
        splitOptions?: SplitOptions,
    ): Observable<T> {
        return this.makeObservable<T>(
            'post',
            url,
            filePathOrStream,
            options,
            splitOptions,
        );
    }

    patch<T = unknown>(
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
        splitOptions?: SplitOptions,
    ): Observable<T> {
        return this.makeObservable<T>(
            'patch',
            url,
            filePathOrStream,
            options,
            splitOptions,
        );
    }

    put<T = unknown>(
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
        splitOptions?: SplitOptions,
    ): Observable<T> {
        return this.makeObservable<T>(
            'put',
            url,
            filePathOrStream,
            options,
            splitOptions,
        );
    }

    private makeObservable<T = unknown>(
        verb: Extract<HTTPAlias, 'get' | 'head'>,
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
        splitOptions?: SplitOptions,
    ): Observable<T>;
    private makeObservable<T = unknown>(
        verb: Extract<HTTPAlias, 'post' | 'put' | 'patch' | 'delete'>,
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
        splitOptions?: SplitOptions,
    ): Observable<T>;
    private makeObservable<T = unknown>(
        verb: HTTPAlias,
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
        { matcher, mapper, options: splitOptions }: SplitOptions = {},
    ): Observable<T> {
        const request: Duplex = this.got.stream[verb](url, {
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
                filePathOrStream.on('data', request.write.bind(request));
                filePathOrStream.on('end', request.end.bind(request));
            } else {
                request.end();
            }
        }

        return new Observable<T>((subscriber: Subscriber<T>) => {
            request
                .pipe(split(matcher, mapper, splitOptions))
                .on('data', subscriber.next.bind(subscriber))
                .on('error', subscriber.error.bind(subscriber))
                .on('end', subscriber.complete.bind(subscriber));
        });
    }
}
