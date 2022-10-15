import http from 'http'
import { requestListenerFacade, streamingRequestListenerFacade } from './requestListeners'
import type { HttpRequest, HttpResponse, HttpStreamingRequest, HttpStreamingResponse } from './types'

// fetch streaming requests
// https://developer.chrome.com/articles/fetch-streaming-requests/

// error handling
// https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/

// common error codes
// https://betterstack.com/community/guides/scaling-nodejs/nodejs-errors/
// https://www.honeybadger.io/blog/errors-nodejs/
// https://nodejs.org/api/errors.html
// https://man7.org/linux/man-pages/man3/errno.3.html

// want an error callback in case the stream closes before finish
// EADDRINUSE, EADDRNOTAVAIL
// ECONNABORTED?
// are there other possible body parsing errors?
// how does express/fastify handle that?

// want some global mechanism in case of 'Port already allocated' errors
// are there other possible global errors?

/**
 * Does not handle any errors. Request body parsing errors
 * or errors thrown by the requestListener will be unhandled
 * @param port - optional, default 80
 * @returns http.Server instance
 */
export const serve = (
  requestListener: (req: HttpRequest) => Promise<HttpResponse>,
  port = 80
) => http.createServer(
  requestListenerFacade(requestListener)
).listen(port)

/**
 * Body stream must close and errors must be handled,
 * or else the response stream will not end. Errors thrown
 * by the requestListener will be unhandled
 * @param port - optional, default 80
 * @returns http.Server instance
 */
export const serveStreaming = (
  requestListener: (req: HttpStreamingRequest) => Promise<HttpStreamingResponse>,
  port = 80,
) => http.createServer(
  streamingRequestListenerFacade(requestListener)
).listen(port)
