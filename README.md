PromiseQ [![Build Status](https://travis-ci.org/nullivex/promiseq.png?branch=master)](https://travis-ci.org/nullivex/promiseq)
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
  return new P(function(resolve){
    process.nextTick(resolve)
  })
}

//add a single job
queue.push(job).then(function(){console.log('Job complete')})

//close the queue and listen for the drain
queue.close().then(function(){console.log('Queue closed and drained')})
```

## Changelog

### 1.1.0
* Deprecated the `processed` stat in favor of `complete`
* Added `failed` stat that tracks error counts
* Added `succeeded` stat which is (`complete` - `failed`)

### 1.0.0
* Update dependencies
* Add `canAccept()` function to queue to see if slots are available
* Add `allowance` to allow overloading of `canAccept()` function
* Fix bug related to definition of total slots
* Update license and distributor details

### 0.1.0
* Initial release
