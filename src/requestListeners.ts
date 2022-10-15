import type { IncomingMessage, ServerResponse } from 'http'
import type { Readable } from 'stream'
import type { HttpRequest, HttpResponse, Method, HttpStreamingRequest, HttpStreamingResponse } from './types'
import * as i from 'ix/asynciterable'

export const readableToString = (req: Readable) =>
  i.toArray(req).then(Buffer.concat).then(b => b.toString())

export const requestListenerFacade = (
  requestListener: (req: HttpRequest) => Promise<HttpResponse>
) => async (req: IncomingMessage, res: ServerResponse) => {
  const { 
    statusCode = 200,
    statusMessage,
    headers: respHeaders, 
    body: respBody, 
  } = await requestListener({
    ...req,
    body: await readableToString(req),
    method: req.method as Method
  })
  res.writeHead(statusCode, statusMessage, respHeaders)
  if (respBody) res.write(respBody)
  res.end()
}

export const streamingRequestListenerFacade = (
  requestListener: (req: HttpStreamingRequest) => Promise<HttpStreamingResponse>
) => async (req: IncomingMessage, res: ServerResponse) => {
  const { 
    statusCode = 200,
    statusMessage,
    headers: respHeaders, 
    body: respBody, 
    trailers,
  } = await requestListener({
    ...req,
    body: req,
    method: req.method as Method,
  })
  res.writeHead(statusCode, statusMessage, respHeaders)
  if (trailers) {
    res.addTrailers(trailers)
  }
  if (respBody) {
    respBody.pipe(res)
    respBody.on('close', () => res.end())
  } else {
    res.end()
  }
}
