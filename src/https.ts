import https, { ServerOptions } from 'https'
import type { IncomingMessage, ServerResponse } from 'http'
import type { HttpRequest, HttpResponse, HttpStreamingRequest, HttpStreamingResponse } from './types'
import { requestListener, streamingRequestListener } from './requestListeners'

export const createServer = ({
  port,
  requestListener: simpleRequestListener,
  httpsOptions,
}: {
  port: number, 
  requestListener: (req: HttpRequest) => Promise<HttpResponse>,
  httpsOptions: ServerOptions<typeof IncomingMessage, typeof ServerResponse>
}) => https.createServer(
  httpsOptions,
  requestListener(simpleRequestListener)
).listen(port)

export const createStreamingServer = ({
  port,
  requestListener: simpleStreamingRequestListener,
  httpsOptions,
}:{
  port: number, 
  requestListener: (req: HttpStreamingRequest) => Promise<HttpStreamingResponse>,
  httpsOptions: ServerOptions<typeof IncomingMessage, typeof ServerResponse>
}) =>  https.createServer(
  httpsOptions,
  streamingRequestListener(simpleStreamingRequestListener)
).listen(port)