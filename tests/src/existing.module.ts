import { Module } from '@nestjs/common';

import { GotConfigService } from './got-config.service';

@Module({
    providers: [GotConfigService],
    exports: [GotConfigService],
})
export class ExistingModule {}
