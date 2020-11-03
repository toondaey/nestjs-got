import { Observable, SchedulerLike } from 'rxjs';

import { isPromise } from '../../../utils';
import { schedulePromise } from './schedulePromise';
import { scheduledAsyncIterable } from './scheduleAsyncIterable';

export const scheduled = <T>(
    input: Promise<T> | AsyncIterator<T>,
    scheduler: SchedulerLike,
    unsubscriber?: ((...args: any[]) => any) | void,
): Observable<T> => {
    if (isPromise(input)) {
        // prettier-ignore
        return schedulePromise<T>(
            input as Promise<T>, 
            scheduler, 
            unsubscriber
        );
    }

    return scheduledAsyncIterable<T>(
        input as AsyncIterator<T>,
        scheduler,
        unsubscriber,
    );
};
