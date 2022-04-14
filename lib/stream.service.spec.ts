import { Duplex } from 'stream';

import { Got, GotStream } from 'got';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { StreamRequest } from './stream.request';
import { StreamService } from './stream.service';
import { GOT_INSTANCE_TOKEN } from './got.constant';

describe('StreamService', () => {
    let service: StreamService;
    const gotInstance: Partial<Got> = {
        defaults: {
            options: jest.fn(),
        } as any,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StreamService,
                StreamRequest,
                {
                    provide: GOT_INSTANCE_TOKEN,
                    useValue: gotInstance,
                },
            ],
        }).compile();

        service = module.get<StreamService>(StreamService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    ['get', 'head', 'post', 'put', 'patch', 'delete'].forEach(verb => {
        it(`${verb}()`, complete => {
            class CustomReadable extends Duplex {
                _read() {
                    let length = 0;
                    const str = `a
    b
    c
    d
    e
    f
    g
    h
    i
    k
    l
    m
    n
    o`.split(/\n/g);

                    while (length < str.length) {
                        this.push(str[length]);
                        length++;
                    }
                    this.push(null);
                }
            }

            const readable = new CustomReadable();

            (gotInstance.stream as Partial<GotStream>) = {
                [verb]: jest.fn().mockReturnValue(readable),
            };

            const request = service[verb](
                faker.internet.url(),
            ) as StreamRequest;

            request.on<Buffer>('data').subscribe({
                next(response) {
                    expect(response.toString()).toEqual(expect.any(String));
                },
            });
            request.on('end').subscribe(complete);
        });
    });
});
