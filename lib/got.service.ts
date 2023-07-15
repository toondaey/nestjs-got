import {
    Got,
    Response,
    GotRequestFunction,
    OptionsOfJSONResponseBody,
} from 'got';
import { Inject, Injectable } from '@nestjs/common';
import { asapScheduler, Observable, SchedulerLike } from 'rxjs';

import { scheduled } from './addons';
import { StreamService } from './stream.service';
import { GOT_INSTANCE_TOKEN } from './got.constant';
import { PaginationService } from './paginate.service';

@Injectable()
export class GotService {
    constructor(
        readonly stream: StreamService,
        readonly pagination: PaginationService,
        @Inject('GOT_INSTANCE_TOKEN') private readonly got: Got,
    ) {}

    head<T = Record<string, any> | []>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
        scheduler?: SchedulerLike,
    ): Observable<Response<T>> {
        return this.makeObservable<T>(this.got.head, url, options, scheduler);
    }

    get<T = Record<string, any> | []>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
        scheduler?: SchedulerLike,
    ): Observable<Response<T>> {
        return this.makeObservable<T>(this.got.get, url, options, scheduler);
    }

    post<T = Record<string, any> | []>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
        scheduler?: SchedulerLike,
    ): Observable<Response<T>> {
        return this.makeObservable<T>(this.got.post, url, options, scheduler);
    }

    put<T = Record<string, any> | []>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
        scheduler?: SchedulerLike,
    ): Observable<Response<T>> {
        return this.makeObservable<T>(this.got.put, url, options, scheduler);
    }

    patch<T = Record<string, any> | []>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
        scheduler?: SchedulerLike,
    ): Observable<Response<T>> {
        return this.makeObservable<T>(this.got.patch, url, options, scheduler);
    }

    delete<T = Record<string, any> | []>(
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
        scheduler?: SchedulerLike,
    ): Observable<Response<T>> {
        return this.makeObservable<T>(this.got.delete, url, options, scheduler);
    }

    get gotRef(): Got {
        return this.got;
    }

    private makeObservable<T>(
        got: GotRequestFunction,
        url: string | URL,
        options?: OptionsOfJSONResponseBody,
        scheduler: SchedulerLike = asapScheduler,
    ): Observable<Response<T>> {
        const request = got<T>(url, {
            ...options,
            responseType: 'json',
            isStream: false,
        });

        return scheduled<Response<T>>(
            request,
            scheduler,
            request.cancel.bind(request),
        );
    }
}
