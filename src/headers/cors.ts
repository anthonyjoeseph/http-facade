// hipster history of cors
// https://www.youtube.com/watch?v=0YJ-yhoJh2I&t=1438s
// "avoid complex cors requests" - use POST instead of delete, use 'Content-Type: application/x-www-form-urlencoded' instead of JSON

// ported from express middleware
// https://github.com/expressjs/cors/blob/master/lib/index.js
// https://github.com/fastify/fastify-cors/blob/master/index.js

// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

// https://web.dev/cross-origin-resource-sharing/

export const permissiveOrigin = {
  'Access-Control-Allow-Origin': "*"
}

export const fixedOrigin = (fixedOrigin: string) => ({
  'Access-Control-Allow-Origin': fixedOrigin,
  Vary: 'Origin'
})

export const methods = (methods: string[]) => ({
  'Access-Control-Allow-Methods': methods.join(',')
})

export const defaultMethods = methods(['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'])

export const credentials = {
  'Access-Control-Allow-Credentials': true
}

export const permissiveAllowHeaders = {
  Vary: 'Access-Control-Request-Headers'
}

export const allowHeaders = (allowedHeaders: string[]) => ({
  'Access-Control-Allow-Headers': allowedHeaders.join(',')
})

export const exposedHeaders = (exposedHeaders: string[]) => ({
  'Access-Control-Expose-Headers': exposedHeaders.join(',')
})

export const maxAge = (maxAge: number) => ({
  'Access-Control-Max-Age': String(maxAge)
})

export const permissiveDefaultResponse = {
  ...permissiveOrigin
}

export const permissiveDefaultOptions = {
  ...permissiveOrigin,
  ...defaultMethods,
  ...permissiveAllowHeaders,
}