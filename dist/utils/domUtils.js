export const $ = (selector, parent) => (parent || document).querySelector(selector);
export const $$ = (selector, parent) => Array.from((parent || document).querySelectorAll(selector));
export const $_ = (selector) => (document).getElementById(selector);
export const $$_ = (selector) => Array.from((document).getElementsByClassName(selector));
