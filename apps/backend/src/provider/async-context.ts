import {
  UnauthorizedError,
  UserWithRolesAndDepartment,
} from '@hospital/shared';
import async_hooks from 'async_hooks';

const asyncLocalStorage = new Map<number, Map<string, any>>();

const asyncHook = async_hooks.createHook({
  init(asyncId: number, type: string, triggerAsyncId: number) {
    const context =
      asyncLocalStorage.get(triggerAsyncId) || new Map<string, any>();
    asyncLocalStorage.set(asyncId, context);
  },
  before(asyncId: number) {
    const context = asyncLocalStorage.get(async_hooks.executionAsyncId());
    const currentContext = asyncLocalStorage.get(asyncId);
    if (currentContext) {
      currentContext.set('context', context);
    }
  },
  destroy(asyncId: number) {
    asyncLocalStorage.delete(asyncId);
  },
});

asyncHook.enable();

export function getContext(): Map<string, any> | undefined {
  return asyncLocalStorage.get(async_hooks.executionAsyncId());
}

const userKey = 'user';

export const setAuthUser = (value: UserWithRolesAndDepartment) => {
  const context = getContext();
  if (context) {
    context.set(userKey, value);
  }
};

export const useAuthUser = (): UserWithRolesAndDepartment => {
  const context = getContext();
  if (context) {
    return context.get(userKey);
  }
  throw new UnauthorizedError();
};
