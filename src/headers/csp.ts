// https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
// https://github.com/helmetjs/content-security-policy-builder
// https://github.com/frux/csp/tree/master/packages/csp-header#readme

// https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html

export const defaultCsp = {
  "Content-Security-Policy": [
    "default-src 'self'", 
    "base-uri 'self'",
    "font-src 'self' https: data:",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "img-src 'self' data:",
    "object-src 'none'",
    "script-src 'self'",
    "script-src-attr 'none'",
    "style-src 'self' https: 'unsafe-inline'",
    "upgrade-insecure-requests"
  ],
}