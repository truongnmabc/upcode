export const parseBoolean = (b: unknown): boolean => {
    if (b === null || b === undefined) return false;
    return b === true || b === "true";
};
