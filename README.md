PromiseQ [![Build Status](https://travis-ci.org/snailjs/promiseq.png?branch=master)](https://travis-ci.org/snailjs/promiseq)
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
  return new P(function(resolve,reject){
    process.nextTick(resolve)
  })
}

//add a single job
queue.push(job).then(function(){console.log('Job complete'}))

//close the queue and listen for the drain
queue.close().then(funciton(){console.log('Queue closed and drained')})
```

## Changelog

### 0.1.0
* Initial release
