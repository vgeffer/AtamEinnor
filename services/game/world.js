//Inport libs
const perlin = require('perlin-noise');
const rng = require('./../util/prng.js');

exports.generate_world = function(x_res, y_res, seed) {
	
	//Define the area of the world we'll be creating
	let chunk = {};
	
	//Create the new instance of LCG Random Number Generator
	let gen = new rng();
	gen.set_seed(seed);

	//Generate the new perlin noise map
	let perlin_map = perlin.generatePerlinNoise(x_res, y_res);

	//Preapre World Structure
	chunk.covers = [];
	chunk.ores = [];
	chunk.size_x = x_res;
	chunk.size_y = y_res;

	//Iterate through the tiles
	for(let y = 0; y < y_res; y++) {
		for(let x = 0; x < x_res; x++) {
		
			//Get the value of the tile
			let cover_value = gen.next_double() * y;

			//Translate the value to the tile type
			if(cover_value <= 4) chunk.covers[y * x_res + x] = {sprite: 0, item: "none", hardness: 1}; //1 tick 
			else if(cover_value <= 20) chunk.covers[y * x_res + x] = {sprite: 1, item: "none", hardness: 2}; //2 tick 
			else chunk.covers[y * x_res + x] = {sprite: 2, item: "none", hardness: 4}; //4 tick 

			//Decide, if the tile contains any ores
			if(perlin_map[y * x_res + x] > 0.4 && y > 2) { 
				
				//If yes, get the amount (between 1 and 4) 
				let ore_value = gen.next_double() * y;
				let ore_count = (gen.next() % 4) + 1;
				
				//Prepare the ore object
				let ore_object = {ore: true, type: 0, sprite: 0, walls: [0,0,0,0,0,0,0]};

				//Translate ore value to ore type
				if(ore_value <= 8) { ore_object.sprite = 6; ore_object.type = 0; }
				else { ore_object.sprite = 7; ore_object.type = 1; }

				//Create ores
				for(let i = 0; i < ore_count; i++) {

					//Place the ores
					let ore_placement = gen.next() % 7;
					ore_object.walls[ore_placement] = 1;
				}

				//Save the ore placement
				chunk.ores[y * x_res + x] = ore_object;
			}
			else
				//If no ores were generated on this tile, save it
				chunk.ores[y * x_res + x] = {ore: false};
		}
	}

	//Return the chunk
	return chunk;
}

