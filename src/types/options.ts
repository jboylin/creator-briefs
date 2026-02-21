export type Options<T> = {
  serialize?: (value: T) => string;
  deserialize?: (raw: string) => T;
};
