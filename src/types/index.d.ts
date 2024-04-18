export {};
// source: https://bobbyhadz.com/blog/typescript-property-does-not-exist-on-type-window#property-does-not-exist-on-type-window-in-typescript
declare global {
    interface Window {
        MathJax: any;
    }
}
