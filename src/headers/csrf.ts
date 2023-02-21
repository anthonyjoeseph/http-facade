// ported from
// https://github.com/fastify/csrf-protection/blob/master/index.js

// use this to generate tokens
// https://github.com/fastify/csrf/blob/master/index.js
// import CSRF from '@fastify/csrf'
// const Tokens = new CSRF(opts)

// https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html

import { IncomingHttpHeaders } from "http"

// Dont use this!
function getTokenDefault (req) {
  return (req.body && req.body._csrf) ||
    req.headers['csrf-token'] ||
    req.headers['xsrf-token'] ||
    req.headers['x-csrf-token'] ||
    req.headers['x-xsrf-token']
}

const defaultOptions = {
  cookieKey: '_csrf',
  cookieOpts: { path: '/', sameSite: true, httpOnly: true },
  sessionKey: '_csrf',
  getToken: getTokenDefault,
  getUserInfo: () => undefined,
  sessionPlugin: '@fastify/cookie'
}

export const getToken = (headers: IncomingHttpHeaders): string | undefined => 
  headers['csrf-token'] as string | undefined
  ?? headers['xsrf-token'] as string | undefined
  ?? headers['x-csrf-token'] as string | undefined
  ?? headers['x-xsrf-token'] as string | undefined