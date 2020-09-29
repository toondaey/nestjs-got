import { Observable, Subscriber, Subscription, SchedulerLike } from 'rxjs';

export const scheduledAsyncIterable = <T = any>(
    input: AsyncIterable<T> | AsyncGenerator<T>,
    scheduler: SchedulerLike,
): Observable<T> => {
    return new Observable<T>((subscriber: Subscriber<T>) => {
        const subscription = new Subscription();
        subscription.add(
            scheduler.schedule(() => {
                const iterator = input[Symbol.asyncIterator]();
                subscription.add(
                    scheduler.schedule(function () {
                        iterator.next().then((result: IteratorResult<T>) => {
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
        return subscription;
    });
};
