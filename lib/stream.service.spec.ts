import { Duplex, Readable } from 'stream';

import * as faker from 'faker';
import { Got, GotStream } from 'got';
import { Test, TestingModule } from '@nestjs/testing';

import { GOT_INSTANCE } from './got.constant';
import { StreamRequest } from './stream.request';
import { StreamService } from './stream.service';

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
                {
                    provide: GOT_INSTANCE,
                    useValue: gotInstance,
                },
            ],
        }).compile();

        service = module.get<StreamService>(StreamService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    ['get', 'head'].forEach(verb => {
        it(`${verb}()`, () => {
            class CustomReadable extends Readable {
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

            (service[verb]<string>(
                faker.internet.url(),
                undefined,
            ) as StreamRequest)
                .on<Buffer>('data')
                .subscribe({
                    next(response) {
                        expect(response.toString()).toEqual(expect.any(String));
                    },
                });
        });
    });

    ['post', 'put', 'patch', 'delete'].forEach(verb => {
        it(`${verb}()`, () => {
            class CustomReadable extends Duplex {
                _read() {
                    let length = 10;

                    while (length) {
                        this.push(length.toString());
                        length--;
                    }
                    this.push(null);
                }
            }

            const readable = new CustomReadable();

            (gotInstance.stream as Partial<GotStream>) = {
                [verb]: jest.fn().mockImplementation(() => readable),
            };

            (service[verb](faker.internet.url()) as StreamRequest)
                .on<Buffer>('data')
                .subscribe({
                    next(response) {
                        // prettier-ignore
                        expect(response.toString())
                            .toEqual(expect.any(String));
                    },
                });
        });
    });
});
