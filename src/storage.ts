import type { Storage } from "./types";

export class LocalStorage implements Storage {
  [key: string]: unknown;

  constructor() {
    return new Proxy(this, {
      get: (target, prop: string) => {
        const value = localStorage.getItem(prop);
        if (value) {
          try {
            return JSON.parse(value);
          } catch (e) {
            return value;
          }
        }
        return undefined;
      },
      set: (target, prop: string, value: unknown) => {
        localStorage.setItem(prop, JSON.stringify(value));
        return true;
      },
    });
  }
}
