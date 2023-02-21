import http, { IncomingMessage, request, Server, ServerResponse } from 'http'
import { requestListenerFacade, streamingRequestListenerFacade } from './requestListeners'
import type { HttpRequest, HttpResponse, HttpStreamingRequest, HttpStreamingResponse } from './types'
import readableToString from 'raw-body'
import { parse } from 'content-type'
import { Readable } from 'stream'

/**
 * Does not handle any errors. Request body parsing errors
 * or errors thrown by the requestListener will be unhandled
 * @param requestListener - a function which is automatically added to the 'request' event.
 * @returns http.Server instance
 */
export const createServer = (
  requestListener: (req: HttpRequest) => Promise<HttpResponse>
) => {
  let interruptedBodyHandler = { handle: () => {} }
  const server = http.createServer(
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
 * or else the response stream will not end. Errors thrown
 * by the requestListener x
 * @param port - optional, default 80
 * @returns http.Server instance
 */
export const createStreamingServer = (
  requestListener: (req: HttpStreamingRequest) => Promise<HttpStreamingResponse>,
) => http.createServer(
  streamingRequestListenerFacade(requestListener)
)

const charsetFromContentType = (contentType: string | undefined) => contentType
  ? parse(contentType).parameters.charset 
  : 'utf-8'

/**
 * Is a legal charset/encoding according to RFC 7159 section 8.1
 * @link https://www.rfc-editor.org/rfc/rfc7159#section-8.1
 */
const isCharsetJsonParsable = (charset: string) =>
  jsonParseableCharsets.includes(charset.toLowerCase())
const jsonParseableCharsets = ['utf-8', 'utf-16', 'utf-32']

/**
 * Trim legal whitespace according to RFC 7159 section 2
 * @link https://www.rfc-editor.org/rfc/rfc7159#section-2
 */
const jsonTrimLeft = (payload: string): string => 
  payload.slice(payload.search(/^[\x20\x09\x0a\x0d]/))

http.createServer(
  streamingRequestListenerFacade(
    async (req) => {
      const charset = charsetFromContentType(req.headers['content-type'])
      const stringBody = await readableToString(req.body, { encoding: charset })

      try {
        if (!isCharsetJsonParsable(charset)) throw new Error(`Encoding ${charset} is not JSON parsable`)
        if (!["{", "["].includes(jsonTrimLeft(stringBody).at(0) ?? "")) throw new Error('Json is not an array or object')
        const jsonBody: unknown = JSON.parse(stringBody)
        return {}
      } catch (e) {
        return {
          statusCode: 400,
          statusMessage: "Bad Input",
          body: Readable.from(`Error parsing body\nReceived: ${stringBody}\n\n${JSON.stringify(e, null, 2)}`)
        }
      }
    }
  )
)