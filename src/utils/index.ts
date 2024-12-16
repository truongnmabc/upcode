export const parseBoolean = (b: unknown): boolean => {
    if (b === null || b === undefined) return false;
    return b === true || b === "true";
};

export const validateEmail = (email: string) => {
    if (email?.length == 0) {
        return false;
    }
    const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
    // return true;
};
