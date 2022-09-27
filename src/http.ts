import http from 'http'
import { requestListener, streamingRequestListener } from './requestListeners'
import type { HttpRequest, HttpResponse, HttpStreamingRequest, HttpStreamingResponse } from './types'

export const createServer = ({
  port,
  requestListener: simpleRequestListener,
}:{
  port: number, 
  requestListener: (req: HttpRequest) => Promise<HttpResponse>
}) => http.createServer(
  requestListener(simpleRequestListener)
).listen(port)

export const createStreamingServer = ({
  port,
  requestListener: simpleStreamingRequestListener,
}:{
  port: number, 
  requestListener: (req: HttpStreamingRequest) => Promise<HttpStreamingResponse>
}) => http.createServer(
  streamingRequestListener(simpleStreamingRequestListener)
).listen(port)