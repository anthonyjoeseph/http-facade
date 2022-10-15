import { IncomingMessage, OutgoingHttpHeaders } from "http"
import type { Readable, Writable } from "stream"

export type HttpRequest = Omit<IncomingMessageFacade, 'trailers'> & {
  body: string
}

export type HttpResponse = {
  /**
   * default 200
   */
  statusCode?: number
  statusMessage?: string

  /**
   * If you have multiple values with the same header name, 
   * you must concatenate them with a separator - 
   * usually with a comma ',' but sometimes (e.g. for cookies) with
   * a semicolon ';'. Duplicate keys are disallowed by this type,
   * since they are only allowed if and only if a comma-separated
   * list is also allowed.
   * @link https://stackoverflow.com/a/3097052
   */
  headers?: Record<string, string>
  body?: string
}

export type HttpStreamingRequest = IncomingMessageFacade & {
  body: Readable
}

export type HttpStreamingResponse = Omit<HttpResponse, 'body'> & {
  trailers?: OutgoingHttpHeaders,
  body?: Writable
}

export type IncomingMessageFacade = Omit<
  IncomingMessage,
  | keyof Readable 
  | 'complete'
  | 'setTimeout'
  | 'socket'
  | 'rawHeaders'
  | 'rawTrailers'
  | 'aborted'
  | 'connection'
  | 'httpVersion'
  | 'statusCode'
  | 'statusMessage'
> & {
  method: Method
}

/**
 * @link https://nodejs.dev/en/learn/the-nodejs-http-module/#properties
 */
export type Method = 
  | 'ACL'
  | 'BIND'
  | 'CHECKOUT'
  | 'CONNECT'
  | 'COPY'
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'LINK'
  | 'LOCK'
  | 'M-SEARCH'
  | 'MERGE'
  | 'MKACTIVITY'
  | 'MKCALENDAR'
  | 'MKCOL'
  | 'MOVE'
  | 'NOTIFY'
  | 'OPTIONS'
  | 'PATCH'
  | 'POST'
  | 'PROPFIND'
  | 'PROPPATCH'
  | 'PURGE'
  | 'PUT'
  | 'REBIND'
  | 'REPORT'
  | 'SEARCH'
  | 'SUBSCRIBE'
  | 'TRACE'
  | 'UNBIND'
  | 'UNLINK'
  | 'UNLOCK'
  | 'UNSUBSCRIBE'