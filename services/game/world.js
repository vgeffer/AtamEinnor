const fs = require('fs');

exports.generate_chunk = function(x, y, room) {
    
    let chunk = [];
    room.rng.set_seed(room.seed);

    for(let i = 0; i < 64; i++) {
        chunk[i] = room.rng.next_double();
    }


    //translate chunk to world
    return chunk;
}

const depth_table = [


    {}



];