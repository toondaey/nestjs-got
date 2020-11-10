import { asapScheduler } from 'rxjs';
import { take } from 'rxjs/operators';

import { scheduledAsyncIterable } from './scheduleAsyncIterable';

describe('scheduleAsyncIterable()', () => {
    it('', complete => {
        const iterator = async function* () {
            let i = 1;
            while (true) {
                yield i;
                i += 1;
            }
        };

        const iterable = iterator();
        let count = 1;

        scheduledAsyncIterable<number>(iterable, asapScheduler)
            .pipe(take(5))
            .subscribe({
                next(v) {
                    expect(v).toEqual(count++);
                },
                complete,
            });
    });
});
