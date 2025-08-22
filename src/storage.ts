const storagePrefix = "bcr"; // short of black cat's rise

export function makeStorage() {
  return new Proxy(window.localStorage, {
    get: (target, prop: string) => {
      const value = target.getItem(storagePrefix + prop);
      if (value) {
        return JSON.parse(value);
      }
      return undefined;
    },
    set: (target, prop: string, value: unknown) => {
      target.setItem(storagePrefix + prop, JSON.stringify(value));
      return true;
    },
  });
}
