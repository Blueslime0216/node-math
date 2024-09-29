export const $ = (selector: string, parent?: HTMLElement) => (parent || document).querySelector(selector);
export const $$ = (selector: string, parent?: HTMLElement) => Array.from((parent || document).querySelectorAll(selector));
export const $_ = (selector: string) => (document).getElementById(selector);
export const $$_ = (selector: string) => Array.from((document).getElementsByClassName(selector));