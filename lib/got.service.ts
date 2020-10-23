import {
    Got,
    Response,
    CancelableRequest,
    OptionsOfJSONResponseBody,
} from 'got';
import { Observable, Subscriber } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';

import { GOT_INSTANCE } from './got.constant';
import { StreamService } from './stream.service';
import { AbstractService } from './abstrace.service';
import { PaginationService } from './paginate.service';

@Injectable()
export class GotService extends AbstractService {
    constructor(
        readonly stream: StreamService,
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

    private makeObservable<T = any>(
        method: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head',
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
    ): Observable<Response<T>> {
        const request = this.got[method]<T>(url, {
            ...options,
            responseType: 'json',
            isStream: false,
            ...this.defaults,
        }) as CancelableRequest<Response<T>>;

        return new Observable<Response<T>>(
            (subscriber: Subscriber<Response<T>>) => {
                (request as CancelableRequest<Response<T>>)
                    .then(subscriber.next.bind(subscriber))
                    .catch(subscriber.error.bind(subscriber))
                    .finally(subscriber.complete.bind(subscriber));
            },
        );
    }
}
