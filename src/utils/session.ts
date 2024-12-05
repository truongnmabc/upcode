export function setSession(key: string, value: any): void {
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(key, value);
  }
}

export function getSession(key: string) {
  if (typeof sessionStorage !== "undefined") {
    return sessionStorage.getItem(key);
  }
  return "";
}
