import * as faker from 'faker';
import { Observable } from 'rxjs';
import { Got, HTTPError } from 'got';
import { Test, TestingModule } from '@nestjs/testing';

import { GotService } from './got.service';
import { GOT_INSTANCE } from './got.constant';
import { StreamService } from './stream.service';
import { PaginationService } from './paginate.service';

describe('GotService', () => {
    let service: GotService;
    const gotInstance: Partial<Got> = {
        defaults: {
            options: jest.fn(),
        } as any,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GotService,
                {
                    provide: GOT_INSTANCE,
                    useValue: gotInstance,
                },
                {
                    provide: PaginationService,
                    useValue: {},
                },
                {
                    provide: StreamService,
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<GotService>(GotService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    ['get', 'head', 'post', 'put', 'patch', 'delete'].forEach(
        (key, index, methods) => {
            it(`${key}()`, complete => {
                const result = { body: {} };
                const mock = Promise.resolve(result);
                (mock as any).cancel = jest.fn();

                gotInstance[key] = jest.fn().mockReturnValueOnce(mock);

                const request = service[key]<Record<string, any>>(
                    faker.internet.url(),
                ) as Observable<Record<string, any>>;

                request.subscribe({
                    next(response) {
                        expect(response).toBe(result);
                    },
                    complete,
                });
            });

            if (methods.length - 1 === index) {
                it('gotRef', () =>
                    expect('defaults' in service.gotRef).toBeTruthy());

                it('should check error reporting', () => {
                    const result: any = { body: {}, statusCode: 400 };
                    const mock = Promise.reject(new HTTPError(result));
                    (mock as any).cancel = jest.fn();

                    gotInstance[key] = jest.fn().mockReturnValueOnce(mock);

                    const request = service[key](faker.internet.url());

                    request.subscribe({
                        error(error) {
                            expect(error).toBeInstanceOf(HTTPError);
                        },
                    });
                });
            }
        },
    );
});
