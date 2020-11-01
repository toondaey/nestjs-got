import { Observable, SchedulerLike } from 'rxjs';

export const schedulePromise = <T = any>(
    input: Promise<T>,
    scheduler: SchedulerLike,
    unsubscriber?: Function | void,
): Observable<T> =>
    new Observable<T>(subscription => {
        subscription.add(
            scheduler.schedule<T>(() => {
                input
                    .then(subscription.next.bind(subscription))
                    .catch(subscription.error.bind(subscription))
                    .finally(subscription.complete.bind(subscription));
            }),
        );
        return unsubscriber;
    });
