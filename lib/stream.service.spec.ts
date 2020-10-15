import * as faker from 'faker';
import { Readable } from 'stream';
import { Got, GotStream } from 'got';
import { Test, TestingModule } from '@nestjs/testing';

import { GOT_INSTANCE } from './got.constant';
import { StreamService } from './stream.service';
import { Observable } from 'rxjs';

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

    ['get', 'delete', 'head'].forEach(verb => {
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

            (service[verb]<string>(faker.internet.url(), undefined, {
                matcher: '',
            }) as Observable<string>).subscribe({
                next(response) {
                    console.log(response.toString());
                },
                complete,
            });
        });
    });

    // ['post', 'put', 'patch'].forEach(verb => {
    //     it(`${verb}()`, complete => {
    //         class CustomReadable extends Readable {
    //             _read() {
    //                 let length = 10;

    //                 while (length) {
    //                     this.push(length.toString());
    //                     length--;
    //                 }
    //                 this.push(null);
    //             }
    //         }

    //         const readable = new CustomReadable();

    //         (gotInstance.stream as Partial<GotStream>) = {
    //             [verb]: jest.fn().mockImplementation(() => readable),
    //         };

    //         service[verb]<Buffer>(faker.internet.url()).subscribe({
    //             next(response) {
    //                 console.log(response);
    //             },
    //             complete,
    //         });
    //     });
    // });
});
