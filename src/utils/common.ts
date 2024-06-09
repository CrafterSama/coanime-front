export const hasRole = (arr: [], role: string) =>
  arr?.find(({ name }) => name === role);

export const fakeArray = (length: number): any[] => Array.from({ length });
