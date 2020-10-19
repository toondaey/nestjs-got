import * as faker from 'faker';
import { Got, HTTPError, Response } from 'got';
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
    const exemptedKeys = [
        'makeObservable',
        'request',
        'defaults',
        'constructor',
    ];

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

    const methods = Object.getOwnPropertyNames(GotService.prototype).filter(
        key => !~exemptedKeys.indexOf(key),
    );

    methods.forEach((key, index) => {
        it(`${key}()`, complete => {
            const result: Partial<Response> = { body: {} };

            gotInstance[key] = jest.fn().mockResolvedValueOnce(result);

            service[key](faker.internet.url()).subscribe({
                next(response) {
                    expect(response).toBe(result);
                },
                complete,
            });
        });

        if (methods.length - 2 === index) {
            it('check that defaults is set', () =>
                expect('options' in service.defaults).toBe(true));

            it('should get request', () => {
                service[key](faker.internet.url());
            });

            it('should check error reporting', () => {
                const result: any = { body: {}, statusCode: 400 };

                gotInstance[key] = jest
                    .fn()
                    .mockRejectedValueOnce(new HTTPError(result));

                service[key](faker.internet.url()).subscribe({
                    error(error) {
                        expect(error).toBeInstanceOf(HTTPError);
                    },
                });

                expect(service.request).toBeTruthy();
            });
        }
    });
});
