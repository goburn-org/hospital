import { Maybe } from '@hospital/shared';
import { useCallback } from 'react';
import { NavigateOptions, useSearchParams } from 'react-router-dom';
import { useLatest } from './use-latest';

export const useParam = <T extends string>() => {
  const [_params, setParams] = useSearchParams();
  const ref = useLatest(_params);

  const updateParams = useCallback(
    (param: { [k: string]: string }, option?: NavigateOptions) => {
      setParams(param, option);
    },
    [setParams],
  );

  const resetAll = useCallback(() => {
    setParams({});
  }, [setParams]);
  const updateParam = useCallback(
    (key: T, value: string) => {
      const param = Object.fromEntries(ref.current.entries());
      if (value === '') {
        delete param[key];
        updateParams(param, { replace: true });
        return;
      }
      updateParams({ ...param, [key]: value }, { replace: true });
    },
    [ref, updateParams],
  );
  const param = Object.fromEntries(_params.entries()) as Record<
    T,
    Maybe<string>
  >;

  const removeParam = useCallback(
    (key: T) => {
      const param = Object.fromEntries(ref.current.entries());
      delete param[key];
      updateParams(param, { replace: true });
    },
    [ref, updateParams],
  );
  return { resetAll, updateParam, param, removeParam };
};
