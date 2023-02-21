import type { IncomingMessage, ServerResponse } from 'http'
import { Readable } from 'stream'
import type { HttpRequest, HttpResponse, Method, HttpStreamingRequest, HttpStreamingResponse } from './types'

// parse streaming json
// https://datastation.multiprocess.io/blog/2022-01-06-analyzing-large-json-files-via-partial-json-parsing.html
// https://github.com/juanjoDiaz/streamparser-json
// https://github.com/dscape/clarinet

export const requestListenerFacade = (
  requestListener: (req: HttpRequest) => Promise<HttpResponse>,
  streamingInterrupted: { handle: (fragment: HttpRequest) => void }
) => async (req: IncomingMessage, res: ServerResponse) => {
  let body = ""
  Readable.from(req)
    .on('data', (str) => {
      body += str.toString('utf-8')
    })
    .on('end', async () => {
      const fullRequest = {
        ...req,
        body: body,
        method: req.method as Method
      }
      if (!req.complete) {
        streamingInterrupted.handle(fullRequest)
        res.end()
      } else {
        const {
          statusCode = 200,
          statusMessage,
          headers: respHeaders,
          body: respBody,
        } = await requestListener(fullRequest)
        res.writeHead(statusCode, statusMessage, respHeaders)
        if (respBody) res.write(respBody)
        res.end()
      }
    })
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
    url: req.url as string
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
