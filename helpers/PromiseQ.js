'use strict';
var async = require('async')
var P = require('bluebird')
var os = require('os')



/**
 * Promise PromiseQueue constructor
 * @param {number} workers
 * @param {number} allowance
 * @constructor
 */
var PromiseQueue = function(workers,allowance){
  this.stopping = false
  this.total = 0
  this.failed = 0
  this.workers = +(workers || os.cpus().length)
  this.allowance = (allowance || 0)

  /**
   * Job handler to queued jobs
   * @param {object} job
   * @param {function} next
   */
  var jobHandler = function(job,next){
    //call the function try to get the promise
    var rv = job.func()
    //make sure we have a promise
    if('function' !== typeof rv.then){
      process.nextTick(function(){
        next('Function did not return a promise',job.func.toString())
      })
    } else{
      rv.then(
        function(){
          var args = Array.prototype.slice.call(arguments,0)
          args.unshift(null)
          next.apply(null,args)
        },
        next
      )
    }
  }
  this.q = async.queue(jobHandler,this.workers)
}


/**
 * Push job to queue
 * @param {function} job
 * @return {P}
 */
PromiseQueue.prototype.push = function(job){
  var that = this
  return new P(function(resolve,reject){
    //reject new jobs that are added after shutdown
    if(that.stopping){
      process.nextTick(function(){
        reject(
          new Error('Tried to push new job after queue has been closed'))
      })
    } else {
      that.total++
      that.q.push({func: job},function(){
        var args = Array.prototype.slice.call(arguments,0)
        var err = args.shift()
        if(err){
          that.failed = that.failed + 1
          reject(err)
        } else{
          resolve.apply(null,args)
        }
      })
    }
  })
}


/**
 * Close the queue, drain it and resolve the promise
 * @return {P}
 */
PromiseQueue.prototype.close = function(){
  var that = this
  return new P(function(resolve){
    var stats = that.status()
    //tell the rest of the object we are dead
    that.stopping = true
    //check if the queue is already drained
    if(stats.queued === 0 && stats.running === 0)
      process.nextTick(resolve)
    else
      that.q.drain = resolve
  })
}


/**
 * Check if the queue can accept slots without queuing
 * @returns {boolean}
 */
PromiseQueue.prototype.canAccept = function(){
  var status = this.status()
  return (status.running + status.queued) < (status.slots + status.allowance)
}


/**
 * Get the current queue status
 * @return {{slots: (q.concurrency|*), running: *, length: *, total: *}}
 */
PromiseQueue.prototype.status = function(){
  var complete = this.total - this.q.length() - this.q.running()
  var percent = ((complete / (this.total || 1)) * 100).toFixed(2)
  return {
    slots: this.workers,
    allowance: this.allowance,
    failed: this.failed,
    running: this.q.running(),
    queued: this.q.length(),
    total: this.total,
    processed: complete,
    succeeded: complete - this.failed,
    complete: complete,
    percent: percent
  }
}


/**
 * The raw PromiseQueue class
 * @type {PromiseQueue}
 */
module.exports = PromiseQueue
