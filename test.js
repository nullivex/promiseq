'use strict';
var async = require('async')
//var P = require('bluebird')

//var PromiseQ = require('./index')


//var q = new PromiseQ(1)
var q = async.queue(function(job,next){
  console.log(job)
  next()
},2)

var job = function(){
  return new P(function(resolve){
    setTimeout(resolve,100)
  })
}

process.nextTick(function(){
  for(var i = 0; i < 10; i++){
    console.log('queuing job ' + i)
    q.push({blah: 'fuck it'},console.log)
  }
})


//console.log(q)
//q.close().then(function(){console.log('Queue drained')})
