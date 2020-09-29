// prettier-ignore
import {
    Got,
    OptionsWithPagination
} from 'got';
import { Inject, Injectable } from '@nestjs/common';
import { Observable, asapScheduler, scheduled } from 'rxjs';

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
    ): Observable<T> {
        return this.makeObservable<T, R>('each', url, options);
    }

    all<T = any, R = unknown>(
        url: string | URL,
        options?: OptionsWithPagination<T, R>,
    ): Observable<T[]> {
        return this.makeObservable<T, R>('all', url, options);
    }

    private makeObservable<T, R = unknown>(
        method: 'all',
        url: string | URL,
        options?: OptionsWithPagination<T, R>,
    ): Observable<T[]>;
    private makeObservable<T, R = unknown>(
        method: 'each',
        url: string | URL,
        options?: OptionsWithPagination<T, R>,
    ): Observable<T>;
    private makeObservable<T, R = unknown>(
        method: 'each' | 'all',
        url: string | URL,
        options?: OptionsWithPagination<T, R>,
    ): Observable<T | T[]> {
        options = { ...options, ...this.defaults };

        if (method === 'all') {
            return scheduled(
                this.got.paginate.all<T, R>(url, options),
                asapScheduler,
            );
        }

        return scheduledAsyncIterable<T>(
            this.got.paginate.each<T, R>(url, options),
            asapScheduler,
        );
    }
}
