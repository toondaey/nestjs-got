import {
    Got,
    Response,
    InstanceDefaults,
    CancelableRequest,
    OptionsOfJSONResponseBody,
} from 'got';
import { Observable, Subscriber } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';

import { GOT_INSTANCE } from './got.constant';

@Injectable()
export class GotService {
    readonly defaults: InstanceDefaults;
    private _request!: CancelableRequest;

    constructor(@Inject(GOT_INSTANCE) private readonly got: Got) {
        this.defaults = this.got.defaults;
    }

    head<T = Record<string, any> | []>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
    ): Observable<Response<T>> {
        return this.makeObservable<T>('head', url, options);
    }

    get<T = Record<string, any> | []>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
    ): Observable<Response<T>> {
        return this.makeObservable<T>('get', url, options);
    }

    post<T = Record<string, any> | []>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
    ): Observable<Response<T>> {
        return this.makeObservable<T>('post', url, options);
    }

    put<T = Record<string, any> | []>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
    ): Observable<Response<T>> {
        return this.makeObservable<T>('put', url, options);
    }

    patch<T = Record<string, any> | []>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
    ): Observable<Response<T>> {
        return this.makeObservable<T>('patch', url, options);
    }

    delete<T = Record<string, any> | []>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
    ): Observable<Response<T>> {
        return this.makeObservable<T>('delete', url, options);
    }

    get request(): CancelableRequest {
        return this._request;
    }

    private makeObservable<T = any>(
        method: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head',
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
    ): Observable<Response<T>> {
        this._request = this.got[method](url, {
            ...options,
            responseType: 'json',
            ...this.defaults,
        });

        return new Observable((subscriber: Subscriber<any>) => {
            this._request
                .then(response => subscriber.next(response))
                .catch(
                    (
                        error: Pick<
                            Got,
                            | 'ReadError'
                            | 'HTTPError'
                            | 'ParseError'
                            | 'CacheError'
                            | 'UploadError'
                            | 'CancelError'
                            | 'RequestError'
                            | 'TimeoutError'
                            | 'MaxRedirectsError'
                            | 'UnsupportedProtocolError'
                        >,
                    ) => subscriber.error(error),
                )
                .finally(() => subscriber.complete());
        });
    }
}
