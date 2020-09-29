import { Injectable } from '@nestjs/common';
import { OptionsWithPagination } from 'got';

import { GotService } from '../../lib';

@Injectable()
export class PaginateService {
    constructor(private readonly gotService: GotService) {}

    each(url: string, options?: OptionsWithPagination) {
        return this.gotService.pagination.each(url, options);
    }

    all(url: string, options?: OptionsWithPagination) {
        return this.gotService.pagination.all(url, options);
    }
}
