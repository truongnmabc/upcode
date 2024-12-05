export const parseBoolean = (b: any): boolean => {
  if (b === null || b === undefined) return false;
  return b === true || b === "true";
};
