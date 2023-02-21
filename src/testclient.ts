import fetch from 'node-fetch'
import { Readable } from 'stream'
import * as ix from 'ix/Ix.node'
import * as as from 'ix/asynciterable'
import * as op from 'ix/asynciterable/operators'

// fetch streaming requests
// https://developer.chrome.com/articles/fetch-streaming-requests/

const stream = as.interval(1000).pipe(op.map(String), op.take(10))

fetch('http://localhost', {
  method: 'POST',
  headers: {'Content-Type': 'text/plain'},
  body: Readable.from(stream),
}).then(
  (response) => ix.fromNodeStream(response.body)
    .pipe(op.map(a => a.toString('utf-8')))
    .forEach(a => console.log(a))
);