import { localStorageKeys } from '../../utils/localStorageKey';

const getToken = () => {
  const token = localStorage.getItem(localStorageKeys.TOKEN);
  if (token) {
    return token;
  }
  return null;
};

const setToken = (token: string) => {
  localStorage.setItem(localStorageKeys.TOKEN, token);
};

const removeToken = () => {
  localStorage.removeItem(localStorageKeys.TOKEN);
};

export const apiTokenStorage = {
  getToken,
  setToken,
  removeToken,
};
