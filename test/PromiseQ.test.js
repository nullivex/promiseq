'use strict';
var P = require('bluebird')
var expect = require('chai').expect

var PromiseQ = require('../helpers/PromiseQ')


describe('helpers/PromiseQ',function(){
  it('should instantiate with worker count',function(){
    var q = new PromiseQ(4)
    expect(q.workers).to.equal(4)
  })
  it('should auto fill worker count otherwise',function(){
    var q = new PromiseQ()
    expect(q.workers).to.equal(require('os').cpus().length)
  })
  it.only('should allow execution of a job',function(done){
    this.timeout(10000)
    var q = new PromiseQ()
    var job = function(){
      return new P(function(resolve){

        setTimeout(function(){console.log('resolving promise'); resolve()},10)
      })
    }
    q.push(job).then(done).catch(done)
  })
})
