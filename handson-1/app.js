const log = require('./logger');
const pc = require("exec-1");
const fs = require("fs");
const _ = require('lodash');

// log('Hello world');
// const numbers = [1,2,3,4,5];
// const shuffled = _.shuffle(numbers);

log(`prime checker : ${pc(20)}`);
log(`prime checker : ${pc(5)}`);
// log(shuffled);

const angka = [1,2,3,6,7,9,10];
var prima = []
angka.forEach(e => {
    if(pc(e)){
        prima.push(e);
    }
});
log(`Angka prima:${prima}`);

// fs.readFile("poneglyph.txt","utf-8", (err,data)=>{
//     if(err){
//         log(err);
//         return;
//     }
//     log(data);
// })