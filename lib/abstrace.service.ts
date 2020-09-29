import { Got, InstanceDefaults } from 'got';

export abstract class AbstractService {
    readonly defaults: InstanceDefaults;

    constructor(protected readonly got: Got) {
        this.defaults = this.got.defaults;
    }
}
