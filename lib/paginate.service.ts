// prettier-ignore
import {
    Got,
    OptionsWithPagination
} from 'got';
import { Inject, Injectable } from '@nestjs/common';
import { Observable, asapScheduler, scheduled, SchedulerLike, iif } from 'rxjs';

import { GOT_INSTANCE } from './got.constant';
import { scheduledAsyncIterable } from './addons';
import { AbstractService } from './abstrace.service';

@Injectable()
export class PaginationService extends AbstractService {
    constructor(@Inject(GOT_INSTANCE) got: Got) {
        super(got);
    }

    each<T = any, R = unknown>(
        url: string | URL,
        options?: OptionsWithPagination<T, R>,
        scheduler?: SchedulerLike,
    ): Observable<T> {
        return this.makeObservable<T, R>('each', url, options, scheduler);
    }

    all<T = any, R = unknown>(
        url: string | URL,
        options?: OptionsWithPagination<T, R>,
        scheduler?: SchedulerLike,
    ): Observable<T[]> {
        return this.makeObservable<T, R>('all', url, options, scheduler);
    }

    private makeObservable<T, R>(
        method: 'all',
        url: string | URL,
        options?: OptionsWithPagination<T, R>,
        scheduler?: SchedulerLike,
    ): Observable<T[]>;
    private makeObservable<T, R>(
        method: 'each',
        url: string | URL,
        options?: OptionsWithPagination<T, R>,
        scheduler?: SchedulerLike,
    ): Observable<T>;
    private makeObservable<T, R>(
        method: 'each' | 'all',
        url: string | URL,
        options?: OptionsWithPagination<T, R>,
        scheduler: SchedulerLike = asapScheduler,
    ): Observable<T | T[]> {
        options = { ...options, isStream: false };

        return iif<T[], T>(
            () => method === 'all',
            scheduled<T[]>(
                this.got.paginate.all<T, R>(url, options),
                scheduler,
            ),
            scheduledAsyncIterable<T>(
                this.got.paginate.each<T, R>(url, options),
                scheduler,
            ),
        );
    }
}
