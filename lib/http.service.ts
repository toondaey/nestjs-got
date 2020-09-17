import {
    Got,
    Response,
    InstanceDefaults,
    CancelableRequest,
    OptionsOfJSONResponseBody,
} from 'got/dist/source';
import { Observable, Subscriber } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';

import { HTTP_INSTANCE } from './http.constant';

@Injectable()
export class HttpService<T = any> {
    readonly defaults: InstanceDefaults;
    private _request!: CancelableRequest;

    constructor(@Inject(HTTP_INSTANCE) private readonly got: Got) {
        this.defaults = this.got.defaults;
    }

    head<T = any>(
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

    post<T = any>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
    ): Observable<Response<T>> {
        return this.makeObservable<T>('post', url, options);
    }

    put<T = any>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
    ): Observable<Response<T>> {
        return this.makeObservable<T>('put', url, options);
    }

    patch<T = any>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
    ): Observable<Response<T>> {
        return this.makeObservable<T>('patch', url, options);
    }

    delete<T = any>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
    ): Observable<Response<T>> {
        return this.makeObservable<T>('delete', url, options);
    }

    private set request(value: CancelableRequest) {
        this._request = value;
    }

    getRequest(): CancelableRequest {
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
