import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLevelParam } from '../src/host';

test('?level=N is a 1-based level index, ignored when out of range', () => {
  assert.equal(parseLevelParam('?level=1', 8), 0);
  assert.equal(parseLevelParam('?level=8', 8), 7);
  assert.equal(parseLevelParam('?level=9', 8), null);
  assert.equal(parseLevelParam('?level=0', 8), null);
  assert.equal(parseLevelParam('?level=2.5', 8), null);
  assert.equal(parseLevelParam('?touch', 8), null);
  assert.equal(parseLevelParam('?stall=3', 8, 'stall'), 2);
});

test('all35 lesson links are strict and include the final campaign job',()=>{
 for(let n=1;n<=35;n++)assert.equal(parseLevelParam(`?level=${n}`,35),n-1);
 for(const value of ['0','36','-1','1.5','2x',''])assert.equal(parseLevelParam(`?level=${value}`,35),null);
});

test('ready precedes queued start and exactly one real completion per attempt',async()=>{
 const {createHostReporter}=await import('../src/host');const messages:any[]=[],reporter=createHostReporter(m=>messages.push(m)),attempt={};
 reporter.start(attempt,35);reporter.complete(attempt,35,12.25);assert.deepEqual(messages,[]);
 reporter.ready();reporter.ready();reporter.start(attempt,35);reporter.complete(attempt,35,99);
 assert.deepEqual(messages,[{type:'ready'},{type:'level-start',level:35},{type:'level-complete',level:35,durationMs:12250}]);
 const next={};reporter.start(next,1);assert.equal(messages.at(-1).type,'level-start');
});
test('asset failure discards queued lifecycle events and never reports ready',async()=>{
 const {createHostReporter}=await import('../src/host');const messages:any[]=[],reporter=createHostReporter(m=>messages.push(m));
 reporter.start({},1);reporter.error('missing model');reporter.ready();assert.deepEqual(messages,[{type:'error',message:'missing model'}]);
});
