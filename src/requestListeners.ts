import type { IncomingMessage, ServerResponse } from 'http'
import type { Readable } from 'stream'
import type { HttpRequest, HttpResponse, RequestHeaders, Method, HttpStreamingRequest, HttpStreamingResponse } from './types'
import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/ReadonlyArray'
import * as R from 'fp-ts/ReadonlyRecord'
import * as i from 'ix/asynciterable'

export const groupRequestHeaders = (rawHeaders: string[]) => pipe(
  rawHeaders,
  A.chunksOf(2),
  A.map(([key, value]) => [key.toLowerCase(), [value]] as const),
  R.fromFoldable(A.getSemigroup<string>(), A.Foldable)
) as RequestHeaders

export const readableToString = (req: Readable) =>
  i.toArray(req).then(Buffer.concat).then(b => b.toString())

export const requestListener = (
  requestListener: (req: HttpRequest) => Promise<HttpResponse>
) => async (req: IncomingMessage, res: ServerResponse) => {
  const { 
    statusCode = 200,
    statusMessage,
    headers: respHeaders, 
    body: respBody, 
  } = await requestListener({
    body: await readableToString(req),
    headers: groupRequestHeaders(req.rawHeaders),
    method: req.method as Method
  })
  res.writeHead(statusCode, statusMessage, respHeaders)
  if (respBody) res.write(respBody)
  res.end()
}

export const streamingRequestListener = (
  requestListener: (req: HttpStreamingRequest) => Promise<HttpStreamingResponse>
) => async (req: IncomingMessage, res: ServerResponse) => {
  const { 
    statusCode = 200,
    statusMessage,
    headers: respHeaders, 
    body: respBody, 
  } = await requestListener({
    body: req,
    headers: groupRequestHeaders(req.rawHeaders),
    method: req.method as Method
  })
  res.writeHead(statusCode, statusMessage, respHeaders)
  if (respBody) {
    respBody.pipe(res)
    respBody.on('error', () => res.end())
    respBody.on('close', () => res.end())
  } else {
    res.end()
  }
}
