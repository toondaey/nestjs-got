import {
    Got,
    Response,
    HTTPAlias,
    CancelableRequest,
    OptionsOfJSONResponseBody,
} from 'got';
import { Inject, Injectable } from '@nestjs/common';
import { asapScheduler, Observable, scheduled, SchedulerLike } from 'rxjs';

import { GOT_INSTANCE } from './got.constant';
import { StreamService } from './stream.service';
import { AbstractService } from './abstrace.service';
import { PaginationService } from './paginate.service';

@Injectable()
export class GotService extends AbstractService {
    private _request!: CancelableRequest;

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
        scheduler?: SchedulerLike,
    ): Observable<Response<T>> {
        return this.makeObservable<T>('head', url, options, scheduler);
    }

    get<T = Record<string, any> | []>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
        scheduler?: SchedulerLike,
    ): Observable<Response<T>> {
        return this.makeObservable<T>('get', url, options, scheduler);
    }

    post<T = Record<string, any> | []>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
        scheduler?: SchedulerLike,
    ): Observable<Response<T>> {
        return this.makeObservable<T>('post', url, options, scheduler);
    }

    put<T = Record<string, any> | []>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
        scheduler?: SchedulerLike,
    ): Observable<Response<T>> {
        return this.makeObservable<T>('put', url, options, scheduler);
    }

    patch<T = Record<string, any> | []>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
        scheduler?: SchedulerLike,
    ): Observable<Response<T>> {
        return this.makeObservable<T>('patch', url, options, scheduler);
    }

    delete<T = Record<string, any> | []>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
        scheduler?: SchedulerLike,
    ): Observable<Response<T>> {
        return this.makeObservable<T>('delete', url, options, scheduler);
    }

    private makeObservable<T = any>(
        method: HTTPAlias,
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
        scheduler: SchedulerLike = asapScheduler,
    ): Observable<Response<T>> {
        this._request = this.got[method]<T>(url, {
            ...options,
            responseType: 'json',
            isStream: false,
        });

        return scheduled<Response<T>>(
            this._request as CancelableRequest<Response<T>>,
            scheduler,
        );
    }
}
