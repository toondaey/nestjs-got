import { Type } from '@nestjs/common';

const exemptedKeys = ['pagination', 'constructor'];

export const getMethods = <T>(cl: Type<T>) =>
    Object.getOwnPropertyNames(cl.prototype).filter(
        key => !~exemptedKeys.indexOf(key),
    );
