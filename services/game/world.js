const perlin = require('perlin-noise');
const rng = require('./../util/prng.js');
const { cpuUsage } = require('process');

exports.generate_world = function(x_res, y_res, seed) {
    
    let chunk = {};
    let gen = new rng();

    gen.set_seed(seed);
    let perlin_map = perlin.generatePerlinNoise(x_res, y_res);

    chunk.covers = [];
    chunk.ores = [];
    chunk.size_x = x_res;
    chunk.size_y = y_res;

    for(let y = 0; y < y_res; y++) {
        for(let x = 0; x < x_res; x++) {
        
            let cover_value = gen.next_double() * y;

            //translate the depth
            if(cover_value <= 4) chunk.covers[y * x_res + x] = {sprite: 0, hardness: 1, walls: [1,1,1,1,1,1]}; //1 tick 
            else if(cover_value <= 20) chunk.covers[y * x_res + x] = {sprite: 1, hardness: 2, walls: [1,1,1,1,1,1]}; //1 tick 
            else chunk.covers[y * x_res + x] = {sprite: 2, hardness: 4, walls: [1,1,1,1,1,1]}; //1 tick 


            if(perlin_map[y * x_res + x] > 0.4 && y > 2) { 
                let ore_value = gen.next_double() * y;
                let ore_count = gen.next() % 4;
                
                let ore_object = {ore: true, type: 0, sprite: 0, walls: [0,0,0,0,0,0,0]};

                if(ore_value <= 8) { ore_object.sprite = 6; ore_object.type = 0; }
                else { ore_object.sprite = 7; ore_object.type = 1; }

                for(let i = 0; i < ore_count; i++) {

                    let ore_placement = gen.next() % 7;
                    ore_object.walls[ore_placement] = 1;
                }
                chunk.ores[y * x_res + x] = ore_object;
            }
            else
                chunk.ores[y * x_res + x] = {ore: false};
        }
    }

    //translate chunk to world
    return chunk;
}

