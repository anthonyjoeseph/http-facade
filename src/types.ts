import type { IncomingMessage, OutgoingHttpHeaders, METHODS, IncomingHttpHeaders as MisTypedHeaders } from "http"
import type { Readable, Writable } from "stream"

/**
 * The type `IncomingHttpHeaders` has this problem:
 * 
 * declare const headers: IncomingHttpHeaders
 * const a = headers['custom-value']
 * a?.toLowerCase()  // ERROR - 'a' is string | string[] | undefined
 * ~~~~~~~~~~~~~~~
 * 
 * 'a' should only be `string[]` is in well-known cases like `headers['set-cookie']`
 * 
 * This custom `HttpHeaders` fixes this problem -
 * the type for custom headers is now `string | undefined`,
 * while maintaining type-inference for well-known headers 
 */

type SingleHeaders = keyof {
  [K in keyof MisTypedHeaders as string[] extends MisTypedHeaders[K]
    ? never
    : K]: unknown
}
type ArrayHeaders = keyof {
  [K in keyof MisTypedHeaders as string extends MisTypedHeaders[K]
    ? never
    : K]: unknown
}

export type IncomingHttpHeaders = {
  [K in SingleHeaders | ArrayHeaders]: K extends ArrayHeaders
    ? string[] | undefined
    : string | undefined
} &
  Record<string, string | undefined>

export type HttpRequest = Omit<IncomingMessageFacade, 'trailers' | 'socket' | 'complete' | 'headers'> & {
  body: string;
  headers: IncomingHttpHeaders
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
   * a semicolon ';'. Duplicate keys are disallowed,
   * since a comma-separated list is always a legal alternative.
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
  body?: Readable
}

export type IncomingMessageFacade = Omit<
  IncomingMessage,
  | keyof Readable
  | 'setTimeout'
  | 'rawHeaders'
  | 'rawTrailers'
  | 'aborted'
  | 'connection'
  | 'httpVersionMajor'
  | 'httpVersionMinor'
  | 'statusCode'
  | 'statusMessage'
> & {
  method: Method
  url: string
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