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

    ['get', 'head', 'put', 'post', 'patch', 'delete'].forEach(
        (key, index, methods) => {
            it(`${key}()`, complete => {
                const result: Partial<Response> = { body: {} };

                gotInstance[key] = jest.fn().mockResolvedValueOnce(result);

                service[key](faker.internet.url()).subscribe({
                    next(response) {
                        expect(response).toBe(result);
                    },
                    error(err) {
                        console.log(err);
                    },
                    complete,
                });
            });

            if (methods.length - 1 === index) {
                it('gotRef', () =>
                    expect('defaults' in service.gotRef).toBeTruthy());

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
                });
            }
        },
    );
});
