import { defaultCsp } from "./csp";

// overall security
// https://web.dev/secure/


// headers
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers

// forbidden header name
// https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name

// proxy server
// https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server


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