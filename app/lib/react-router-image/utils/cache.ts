export const generateKey = (
  ...args: (string | number | null | undefined)[]
): string => args.filter((i) => i != null).join('_');

export const kB = (num: number): number => num * 1e3;

export const mB = (num: number): number => num * 1e6;

export const GB = (num: number): number => num * 1e9;

