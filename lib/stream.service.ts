import * as split from 'split';
import { resolve } from 'path';
import { createReadStream } from 'fs';
import { Readable, Duplex } from 'stream';
import { Observable, Subscriber } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { Got, HTTPAlias, StreamOptions } from 'got';

import { GOT_INSTANCE } from './got.constant';
import { AbstractService } from './abstrace.service';

export interface SplitOptions {
    matcher?: string | RegExp;
    mapper?: Function;
    options?: { trailing: boolean; maxLength: number };
}

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
        options?: StreamOptions,
        splitOptions?: SplitOptions,
    ): Observable<T> {
        return this.makeObservable<T>(
            'delete',
            url,
            undefined,
            options,
            splitOptions,
        );
    }

    post<T = unknown>(
        url: string | URL,
        filePathOrStream: string | Readable,
        options?: StreamOptions,
    ): Observable<T> {
        return this.makeObservable<T>('post', url, filePathOrStream, options);
    }

    patch<T = unknown>(
        url: string | URL,
        filePathOrStream: string | Readable,
        options?: StreamOptions,
    ): Observable<T> {
        return this.makeObservable<T>('patch', url, filePathOrStream, options);
    }

    put<T = unknown>(
        url: string | URL,
        filePathOrStream: string | Readable,
        options?: StreamOptions,
    ): Observable<T> {
        return this.makeObservable<T>('put', url, filePathOrStream, options);
    }

    private makeObservable<T = unknown>(
        verb: Extract<HTTPAlias, 'get' | 'head' | 'delete'>,
        url: string | URL,
        filePathOrStream?: string | Readable,
        options?: StreamOptions,
        splitOptions?: SplitOptions,
    ): Observable<T>;
    private makeObservable<T = unknown>(
        verb: Extract<HTTPAlias, 'post' | 'put' | 'patch'>,
        url: string | URL,
        filePathOrStream: string | Readable,
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
        const stream: Duplex = this.got.stream[verb](url, {
            ...this.defaults,
            ...options,
            isStream: true,
        });

        if (!!~['patch', 'post', 'put'].indexOf(verb)) {
            const cwd = process.cwd();
            if (typeof filePathOrStream === 'string') {
                filePathOrStream = createReadStream(
                    resolve(cwd, filePathOrStream),
                );
                filePathOrStream?.on('end', stream.end.bind(stream));
                filePathOrStream?.on(
                    'end',
                    filePathOrStream?.destroy.bind(filePathOrStream),
                );
            }

            (filePathOrStream as Readable)?.on(
                'data',
                stream.write.bind(stream),
            );
        }

        return new Observable<T>((subscriber: Subscriber<T>) => {
            stream
                .pipe(split(matcher, mapper, splitOptions))
                .on('data', subscriber.next.bind(subscriber))
                .on('error', subscriber.error.bind(subscriber))
                .on('end', subscriber.complete.bind(subscriber));
        });
    }
}
