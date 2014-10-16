'use strict';
var P = require('bluebird')
var expect = require('chai').expect

var PromiseQ = require('../helpers/PromiseQ')

var job = function(){
  return new P(function(resolve){
    setTimeout(resolve,10)
  })
}


describe('helpers/PromiseQ',function(){
  it('should instantiate with worker count',function(){
    var q = new PromiseQ(4)
    expect(q.workers).to.equal(4)
  })
  it('should auto fill worker count otherwise',function(){
    var q = new PromiseQ()
    expect(q.workers).to.equal(require('os').cpus().length)
  })
  it('should allow execution of a job',function(done){
    this.timeout(10000)
    var q = new PromiseQ()
    q.push(job).then(done).catch(done)
  })
  it('should close the queue after all jobs finish',function(done){
    var q = new PromiseQ()
    for(var i = 0; i < 10; i++) q.push(job)
    q.close().then(done).catch(done)
  })
  it('should bubble arguments to the resulting promise',function(done){
    var q = new PromiseQ()
    q.push(function(){
      return new P(function(resolve){
        process.nextTick(function(){
          resolve(['foo','bar','baz'])
        })
      })
    })
      .then(function(args){
        expect(args[0]).to.equal('foo')
        expect(args[1]).to.equal('bar')
        expect(args[2]).to.equal('baz')
        done()
      })
      .catch(done)
  })
  it('should bubble errors',function(done){
    var q = new PromiseQ()
    q.push(function(){
      return new P(function(resolve,reject){
        process.nextTick(function(){
          reject(new Error('foo'))
        })
      })
    })
      .then(function(){
        done('error didnt bubble')
      })
      .catch(function(err){
        expect(err).to.be.instanceOf(Error)
        expect(err.message).to.equal('foo')
        done()
      })
  })
})
