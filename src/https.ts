import https, { Server, ServerOptions } from 'https'
import type { IncomingMessage, ServerResponse } from 'http'
import type { HttpRequest, HttpResponse, HttpStreamingRequest, HttpStreamingResponse } from './types'
import { requestListenerFacade, streamingRequestListenerFacade } from './requestListeners'

/**
 * Does not handle any errors. Request body parsing errors
 * will be unhandled
 * @param httpsOptions - see https.ServerOptions
 * @param requestListener - a function which is automatically added to the 'request' event.
 * @returns http.Server instance
 */
export const createServer = (
  httpsOptions: ServerOptions<typeof IncomingMessage, typeof ServerResponse>,
  requestListener: (req: HttpRequest) => Promise<HttpResponse>
) => {
  let interruptedBodyHandler = { handle: () => {} }
  const server = https.createServer(
    httpsOptions,
    requestListenerFacade(requestListener, interruptedBodyHandler)
  )
  const tmp = server.on
  server.on = (event: string, listener: (...args: any[]) => void) => {
    if(event === 'interruptedBody') {
      interruptedBodyHandler.handle = listener
      return server;
    } else {
      return tmp(event, listener)
    }
  }
  return server as Server<typeof IncomingMessage, typeof ServerResponse> & {
    on: Server<typeof IncomingMessage, typeof ServerResponse>['on'] 
      & ((event: 'interruptedBody', listener: (fragment: HttpRequest) => void) => void)
  }
}

/**
 * Body stream must close and errors must be handled,
 * or else the response stream will not end
 * @param httpsOptions - see https.ServerOptions
 * @param port - optional, default 443
 * @returns http.Server instance
 */
export const createStreamingServer = (
  httpsOptions: ServerOptions<typeof IncomingMessage, typeof ServerResponse>,
  requestListener: (req: HttpStreamingRequest) => Promise<HttpStreamingResponse>
) => https.createServer(
  httpsOptions,
  streamingRequestListenerFacade(requestListener)
)