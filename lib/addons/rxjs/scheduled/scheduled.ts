import { Observable, SchedulerLike } from 'rxjs';

import { schedulePromise } from './schedulePromise';
import { scheduledAsyncIterable } from './scheduleAsyncIterable';

export const scheduled = <T>(
    input: Promise<T> | AsyncIterator<T>,
    scheduler: SchedulerLike,
    unsubscriber: Function | void,
): Observable<T> => {
    if (
        typeof (input as Promise<T>)?.then == 'function' ||
        input instanceof Promise
    ) {
        return schedulePromise<T>(input as Promise<T>, scheduler, unsubscriber);
    }

    return scheduledAsyncIterable<T>(input, scheduler, unsubscriber);
};
