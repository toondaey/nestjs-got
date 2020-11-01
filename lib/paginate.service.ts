// prettier-ignore
import {
    Got,
    GotPaginate,
    OptionsWithPagination
} from 'got';
import { Inject, Injectable } from '@nestjs/common';
import { Observable, asapScheduler, SchedulerLike } from 'rxjs';

import { scheduled } from './addons';
import { GOT_INSTANCE } from './got.constant';

@Injectable()
export class PaginationService {
    constructor(@Inject(GOT_INSTANCE) private readonly got: Got) {}

    each<T = any, R = unknown>(
        url: string | URL,
        options?: OptionsWithPagination<T, R>,
        scheduler?: SchedulerLike,
    ): Observable<T> {
        return this.makeObservable<T, R>(
            this.got.paginate.each,
            url,
            options,
            scheduler,
        );
    }

    all<T = any, R = unknown>(
        url: string | URL,
        options?: OptionsWithPagination<T, R>,
        scheduler?: SchedulerLike,
    ): Observable<T[]> {
        return this.makeObservable<T, R>(
            this.got.paginate.all,
            url,
            options,
            scheduler,
        );
    }

    private makeObservable<T, R>(
        paginate: GotPaginate['all'],
        url: string | URL,
        options?: OptionsWithPagination<T, R>,
        scheduler?: SchedulerLike,
    ): Observable<T[]>;
    private makeObservable<T, R>(
        paginate: GotPaginate['each'],
        url: string | URL,
        options?: OptionsWithPagination<T, R>,
        scheduler?: SchedulerLike,
    ): Observable<T>;
    private makeObservable<T, R>(
        paginate: <T, _R>(
            ...args: any[]
        ) => Promise<T[]> | AsyncIterableIterator<T>,
        url: string | URL,
        options?: OptionsWithPagination<T, R>,
        scheduler: SchedulerLike = asapScheduler,
    ): Observable<T | T[]> {
        options = { ...options, isStream: false };

        return scheduled<T | T[]>(paginate<T, R>(url, options), scheduler);
    }
}
