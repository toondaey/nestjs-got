import * as faker from 'faker';
import { Readable } from 'stream';
import { Observable } from 'rxjs';
import { Got, GotStream } from 'got';
import { Test, TestingModule } from '@nestjs/testing';

import { GOT_INSTANCE } from './got.constant';
import { SplitOptions } from './got.interface';
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

    ['get' /* , 'delete', 'head' */].forEach(verb => {
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
                [verb]: jest.fn().mockImplementation(() => readable),
            };

            (service[verb]<string>('https://reqres.in/api/users', undefined, {
                // matcher: '\n',
                // mapper: ()
            } as SplitOptions) as Observable<string>).subscribe({
                next(response) {
                    console.log(response.toString() + 'one');
                },
                complete,
            });
        });
    });

    ['post', 'put', 'patch'].forEach(verb => {
        it(`${verb}()`, complete => {
            class CustomReadable extends Readable {
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
                    console.log(response);
                },
                complete,
            });
        });
    });
});
