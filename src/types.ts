import type { Readable, Writable } from "stream"

export type NonEmptyArray<A> = [A, ...A[]]

/**
 * Names are lowercased.
 * Duplicate names are consolidated into a non-empty array
 */
export type RequestHeaders = Record<string, NonEmptyArray<string>>

/**
 * If you have multiple values with the same header name, 
 * you must concatenate them with a separator - 
 * usually with a comma ',' but sometimes (e.g. for cookies) with
 * a semicolon ';'. Duplicate keys are disallowed by this type,
 * since they are only allowed if and only if a comma-separated
 * list is also allowed.
 * @link https://stackoverflow.com/a/3097052
 */
export type ResponseHeaders = Record<string, string>

export type HttpRequest = {
  method: Method
  headers: RequestHeaders
  body: string
}

export type HttpResponse = {
  /**
   * default 200
   */
  statusCode?: number
  statusMessage?: string
  headers?: ResponseHeaders
  body?: string
}

export type HttpStreamingRequest = {
  method: Method
  headers: RequestHeaders
  body: Readable
}

export type HttpStreamingResponse = {
  /**
   * default 200
   */
  statusCode?: number
  statusMessage?: string
  headers?: ResponseHeaders
  body?: Writable
}

/**
 * defined here: https://nodejs.dev/en/learn/the-nodejs-http-module/#properties
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