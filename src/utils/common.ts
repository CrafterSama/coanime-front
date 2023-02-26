export const hasRole = (arr: [], role: string) =>
  arr?.find(({ name }) => name === role);
