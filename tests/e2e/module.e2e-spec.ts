import faker from 'faker';
import { Got } from 'got';
import { Test, TestingModule } from '@nestjs/testing';

import { HttpService } from '../../lib';
import { AppModule } from '../src/app.module';
import { HTTP_INSTANCE } from '../../lib/http.constant';

describe('MailerModule', () => {
    let module: TestingModule, got: Got, httpService: HttpService;

    describe('test synchronous module registration', () => {
        describe('register()', () => {
            beforeEach(async () => {
                module = await Test.createTestingModule({
                    imports: [AppModule.withRegister()],
                }).compile();
            });

            it('should register redis module', async () => {
                got = module.get<Got>(HTTP_INSTANCE);
                expect(AppModule.isGotInstance(got)).toBeTruthy();
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

            it('should register redis module', async () => {
                got = module.get(HTTP_INSTANCE);
                expect(AppModule.isGotInstance(got)).toBeTruthy();
            });
        });

        describe('useClass', () => {
            beforeEach(async () => {
                module = await Test.createTestingModule({
                    imports: [AppModule.withUseClassRegisterAsync()],
                }).compile();

                httpService = module.get<HttpService>(HttpService);
            });

            it('should register redis module', async () => {
                got = module.get(HTTP_INSTANCE);
                expect(AppModule.isGotInstance(got)).toBeTruthy();
            });
        });
    });
});
