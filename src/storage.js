import { storageKey } from './constants';

export const setItem = (key, item) => {
  sessionStorage.setItem(`${storageKey}.${key}`, JSON.stringify(item));
};

export const getItem = key => {
  const item = sessionStorage.getItem(`${storageKey}.${key}`);
  console.log(item);
  if (item === null) {
    return null;
  }

  return JSON.parse(item);
};
