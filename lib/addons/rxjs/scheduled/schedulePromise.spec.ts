import { asapScheduler } from 'rxjs';

import { schedulePromise } from './schedulePromise';

describe('schedulePromise()', () => {
    it('', () => {
        const promised = jest.fn().mockResolvedValue(1) as any;

        schedulePromise(promised, asapScheduler).subscribe({
            next(v) {
                expect(v).toEqual(1);
            },
        });
    });
});
