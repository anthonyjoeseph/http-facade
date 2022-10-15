import https, { ServerOptions } from 'https'
import type { IncomingMessage, ServerResponse } from 'http'
import type { HttpRequest, HttpResponse, HttpStreamingRequest, HttpStreamingResponse } from './types'
import { requestListenerFacade, streamingRequestListenerFacade } from './requestListeners'

/**
 * Does not handle any errors. Request body parsing errors
 * will be unhandled
 * @param httpsOptions - see https.ServerOptions
 * @param port - optional, default 443
 * @returns http.Server instance
 */
export const serve = (
  httpsOptions: ServerOptions<typeof IncomingMessage, typeof ServerResponse>,
  requestListener: (req: HttpRequest) => Promise<HttpResponse>,
  port = 443,
) => https.createServer(
  httpsOptions,
  requestListenerFacade(requestListener)
).listen(port)

/**
 * Body stream must close and errors must be handled,
 * or else the response stream will not end
 * @param httpsOptions - see https.ServerOptions
 * @param port - optional, default 443
 * @returns http.Server instance
 */
export const serveStreaming = (
  httpsOptions: ServerOptions<typeof IncomingMessage, typeof ServerResponse>,
  requestListener: (req: HttpStreamingRequest) => Promise<HttpStreamingResponse>,
  port = 443,
) => https.createServer(
  httpsOptions,
  streamingRequestListenerFacade(requestListener)
).listen(port)