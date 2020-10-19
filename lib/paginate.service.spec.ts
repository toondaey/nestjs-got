import * as faker from 'faker';
import { Got, GotPaginate, HTTPError } from 'got';
import { Test, TestingModule } from '@nestjs/testing';

import { GotService } from './got.service';
import { GOT_INSTANCE } from './got.constant';
import { PaginationService } from './paginate.service';

describe('GotService', () => {
    let service: PaginationService;
    const gotInstance: Partial<Got> = {
        defaults: {
            options: jest.fn(),
        } as any,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaginationService,
                {
                    provide: GOT_INSTANCE,
                    useValue: gotInstance,
                },
                {
                    provide: GotService,
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<PaginationService>(PaginationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it(`each()`, complete => {
        async function* asyncIterator() {
            const itemsCount = faker.random.number(20);

            for (let _ = 0; _ < itemsCount; _++) {
                yield { a: faker.random.alphaNumeric() };
            }
        }

        (gotInstance.paginate as Partial<GotPaginate>) = {
            each: jest.fn().mockImplementation(() => asyncIterator()),
        };

        service.each(faker.internet.url()).subscribe({
            next(response) {
                expect(response).toEqual(
                    expect.objectContaining({ a: expect.any(String) }),
                );
            },
            complete,
        });
    });

    it('all()', complete => {
        (gotInstance.paginate as Partial<GotPaginate>) = {
            all: jest.fn().mockResolvedValue([1, 2, 3, 4, 5]),
        };

        service.all(faker.internet.url()).subscribe({
            next(response) {
                expect(response).toEqual(
                    expect.arrayContaining([expect.any(Number)]),
                );
            },
            complete,
        });
    });

    it('check that defaults is set', () =>
        expect('options' in service.defaults).toBe(true));

    it('should check error reporting', () => {
        const result: any = { body: {}, statusCode: 400 };

        (gotInstance.paginate as Partial<GotPaginate>) = {
            all: jest.fn().mockRejectedValueOnce(new HTTPError(result)),
        };

        service.all(faker.internet.url()).subscribe({
            error(error) {
                expect(error).toBeInstanceOf(HTTPError);
            },
        });
    });
});
