import { Observable, Subscriber, SchedulerLike } from 'rxjs';

export const scheduledAsyncIterable = <T = any, TReturn = any>(
    input: AsyncIterator<T, TReturn>,
    scheduler: SchedulerLike,
): Observable<T> => {
    return new Observable<T>((subscriber: Subscriber<T>) =>
        scheduler.schedule<T>(() => {
            const iterator = input[Symbol.asyncIterator]();
            subscriber.add(
                scheduler.schedule<T>(function () {
                    iterator
                        .next()
                        .then((result: IteratorResult<T, TReturn>) => {
                            if (result.done) {
                                subscriber.complete();
                            } else {
                                subscriber.next(result.value);
                                this.schedule();
                            }
                        });
                }),
            );
        }),
    );
};
