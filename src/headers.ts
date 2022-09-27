// headers
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers

// forbidden header name
// https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name

// proxy server
// https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server

// https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
// https://github.com/helmetjs/content-security-policy-builder
// https://github.com/frux/csp/tree/master/packages/csp-header#readme
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

// https://github.com/fastify/fastify-helmet/blob/master/index.js
// https://github.com/helmetjs/helmet/blob/main/index.ts
export const defaultHelmet = {
  ...defaultCsp,
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Origin-Agent-Cluster": "?1",
  "Referrer-Policy": "no-referrer",
  "Strict-Transport-Security": "max-age=15552000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-DNS-Prefetch-Control": "off",
  "X-Download-Options": "noopen",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Permitted-Cross-Domain-Policies": "none",
  "X-XSS-Protection": "0"
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
// https://github.com/expressjs/cors/blob/master/lib/index.js
// https://github.com/fastify/fastify-cors/blob/master/index.js
export const defaultCors = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: false,
  exposedHeaders: null,
  allowedHeaders: null,
  maxAge: null,
  preflight: true,
  strictPreflight: true,
  'Access-Control-Max-Age': 0,
  'Access-Control-Allow-Headers': 0,
  'Access-Control-Request-Headers': 0,
  'Access-Control-Allow-Credentials': 0,
  'Access-Control-Allow-Methods': 0,
  'Access-Control-Allow-Origin': 0,
}

// https://github.com/fastify/csrf-protection/blob/master/index.js
export const defaultCsrfProtection = {
  cookieKey: '_csrf',
  cookieOpts: { path: '/', sameSite: true, httpOnly: true },
  sessionKey: '_csrf',
  getToken: undefined,
  getUserInfo: undefined,
  sessionPlugin: '@fastify/cookie'
}