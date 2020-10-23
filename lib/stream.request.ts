import { resolve } from 'path';
import { createReadStream } from 'fs';
import { Duplex, Readable } from 'stream';

import { fromEvent, Observable } from 'rxjs';
import { Got, HTTPAlias, StreamOptions } from 'got';

export class StreamRequest {
    private _request!: Duplex;

    private constructor() {
        //
    }

    static create(
        got: Got,
        verb: HTTPAlias,
        url: string | URL,
        file?: string | Readable,
        streamOptions: StreamOptions = {},
    ): StreamRequest {
        return new StreamRequest()
            .createRequest(got, verb, url, streamOptions)
            .writeToRequest(verb, file);
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
        return fromEvent<T>(this._request, eventName, eventListenerOptions);
    }

    private createRequest(
        got: Got,
        verb: string,
        url: string | URL,
        streamOptions?: StreamOptions,
    ): this {
        this._request = got.stream[verb](url, {
            ...got.defaults,
            ...streamOptions,
            isStream: true,
        });

        return this;
    }

    private writeToRequest(verb: HTTPAlias, file?: string | Readable): this {
        if (typeof file === 'string') {
            file = createReadStream(resolve(process.cwd(), file));
            file.on('end', file.destroy.bind(file));
        }

        if (file instanceof Readable) {
            file.on('data', this._request.write.bind(this._request));
            file.on('end', this._request.end.bind(this._request));
        } else if (!!~['post', 'put', 'patch', 'delete'].indexOf(verb)) {
            this._request.end();
        }

        return this;
    }
}
