import {
    Got,
    Response,
    CancelableRequest,
    OptionsOfJSONResponseBody,
} from 'got';
import { Observable, Subscriber } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';

import { GOT_INSTANCE } from './got.constant';
import { AbstractService } from './abstrace.service';
import { PaginationService } from './paginate.service';

@Injectable()
export class GotService extends AbstractService {
    protected _request!: CancelableRequest<Response<any>>;

    constructor(
        @Inject(GOT_INSTANCE) got: Got,
        readonly pagination: PaginationService,
    ) {
        super(got);
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
        this._request = this.got[method]<T>(url, {
            ...options,
            responseType: 'json',
            ...this.defaults,
        });

        return new Observable<Response<T>>(
            (subscriber: Subscriber<Response<T>>) => {
                this._request
                    .then((response: Response<T>) => subscriber.next(response))
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
            },
        );
    }
}
