promiseq
========

Promise queue for node.js

This package will maintain a queue of promises and use promises to return
completion of a task as well as completion of the queue.

Useful for migrations and work queues. This is inspired by `promise-queue` but
built for Node.js and uses `bluebird` to provide the promises and `async.queue`
to facilitate the queue operations.

## Usage

```js
var P = require('bluebird') //or whatever promise library you prefer such as `Q`
var PromiseQueue = require('promiseq')
var workerCount = 4 //defaults to number of cpus when left null

//setup the queue
var queue = new PromiseQueue(workerCount)

//make a job
var job = function(){
  return 
queue.push
