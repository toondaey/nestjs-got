import * as nock from 'nock';
import * as faker from 'faker';
import { Got, RequestError } from 'got';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { AppService } from '../src/app.service';
import { GOT_INSTANCE } from '../../lib/got.constant';

describe('GotModule', () => {
    let module: TestingModule, gotInstance: Got;

    describe('test synchronous module registration', () => {
        describe('register()', () => {
            beforeEach(async () => {
                module = await Test.createTestingModule({
                    imports: [AppModule.withRegister()],
                }).compile();
            });

            it('should register got module', async () => {
                gotInstance = module.get<Got>(GOT_INSTANCE);
                expect(AppModule.isGotInstance(gotInstance)).toBeTruthy();
            });
        });
    });

    describe('test asynchronous module registration', () => {
        describe('useFactory()', () => {
            beforeEach(async () => {
                module = await Test.createTestingModule({
                    imports: [AppModule.withUseFactoryRegisterAsync()],
                }).compile();
            });

            it('should register got module', async () => {
                gotInstance = module.get(GOT_INSTANCE);
                expect(AppModule.isGotInstance(gotInstance)).toBeTruthy();
            });
        });

        describe('useClass', () => {
            beforeEach(async () => {
                module = await Test.createTestingModule({
                    imports: [AppModule.withUseClassRegisterAsync()],
                }).compile();
            });

            it('should register got module', async () => {
                gotInstance = module.get(GOT_INSTANCE);
                expect(AppModule.isGotInstance(gotInstance)).toBeTruthy();
            });
        });

        describe('test features', () => {
            describe('GotService', () => {
                let appService: AppService,
                    exemptedKeys = [
                        'makeObservable',
                        'request',
                        'defaults',
                        'constructor',
                    ];
                beforeEach(async () => {
                    module = await Test.createTestingModule({
                        imports: [AppModule.withRegister()],
                        providers: [AppService],
                        exports: [AppService],
                    }).compile();

                    appService = module.get<AppService>(AppService);
                });

                const methods = Object.getOwnPropertyNames(
                    AppService.prototype,
                ).filter(key => !~exemptedKeys.indexOf(key));

                methods.forEach((key, index) => {
                    it(`${key}()`, complete => {
                        const url = faker.internet.url();
                        const route = faker.internet.domainWord();
                        const res = { random: 'random' };

                        nock(url)[key](`/${route}`).reply(200, res, {
                            'Content-Type': 'application/json',
                        });

                        appService[key](`${url}/${route}`).subscribe({
                            next(response) {
                                expect(response).toEqual(
                                    expect.objectContaining({
                                        body: res,
                                    }),
                                );
                            },
                            complete,
                        });
                    });

                    if (methods.length - 2 === index) {
                        it('should check error reporting', complete => {
                            const url = faker.internet.url();
                            const route = faker.internet.domainWord();
                            const res = {
                                message: 'Invalid params',
                                get response() {
                                    return this.message;
                                },
                                code: 400,
                            };

                            nock(url)[key](`/${route}`).replyWithError(res);

                            appService[key](`${url}/${route}`).subscribe({
                                error(error) {
                                    expect(error).toBeInstanceOf(RequestError);
                                    expect(error.code).toEqual(res.code);
                                    complete();
                                },
                            });
                        });
                    }
                });
            });
        });
    });
});
