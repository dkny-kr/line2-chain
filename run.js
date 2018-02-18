'use strict';

const Line2Chain = require('./line2-chain');

Line2Chain.config('sample');

Line2Chain.getChain('weekday')
  .then(chain => {
    console.log(chain);
    // console.log('train_num,from,dest,prev_train,next_train');
    // for(const c of chain) {
    //   console.log(`${c.train_num},${c.from},${c.dest},${c.prev_train},${c.next_train}`);
    // }
  })
  .catch(e => {
    console.log(e);
  });