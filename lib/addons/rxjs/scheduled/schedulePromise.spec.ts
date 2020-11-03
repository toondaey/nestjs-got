import { asapScheduler } from 'rxjs';

import { schedulePromise } from './schedulePromise';

describe('schedulePromise()', () => {
    it('', () => {
        const promised = Promise.resolve(1);

        schedulePromise(promised, asapScheduler).subscribe({
            next(v) {
                expect(v).toEqual(1);
            },
        });
    });
});
