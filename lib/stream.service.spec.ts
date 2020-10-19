import * as faker from 'faker';
import { Observable } from 'rxjs';
import { Got, GotStream } from 'got';
import { Duplex, Readable } from 'stream';
import { Test, TestingModule } from '@nestjs/testing';

import { GOT_INSTANCE } from './got.constant';
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
        it(`${verb}()`, complete => {
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
                'https://reqres.in/api/users',
                undefined,
            ) as Observable<string>).subscribe({
                next(response) {
                    expect(response.toString()).toEqual(expect.any(String));
                },
                complete,
            });
        });
    });

    ['post', 'put', 'patch', 'delete'].forEach(verb => {
        it(`${verb}()`, complete => {
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

            service[verb]<Buffer>(faker.internet.url()).subscribe({
                next(response) {
                    expect(response).toEqual(expect.any(String));
                },
                complete,
            });
        });
    });
});
