//Import libs
const crypto = require('crypto');
const world = require('./../game/world.js');
const ws = require('./../network/socket.js');
const { RoundTick } = require('./player.js');
let rooms = new Map();



//ROUND TIME
const ROUND_TIMER = 15 * 1000; //In ms
//----------

//Function, to create the room with the set parameters
exports.create_room = function(player_count, turn_count) {

	//Set up room object
	let id = "";
	let room_obj = {};

	//Create the id of the room
	do {
		//Generate the random ID
		id = crypto.randomBytes(4).toString('hex').toLowerCase();
	} while(rooms.has(id));

	//Create the room object
	room_obj.pcount 		= player_count; //Size of the room (player count)
	room_obj.spcount 		= 0; //Active (logged) player count
	room_obj.exp 			= Date.now() + 12 * 60 * 60 * 1000; //12 hours lifetime of the room
	room_obj.world 			= world.generate_world(48, 32, crypto.randomBytes(4).readUInt32BE()); //Game world
	room_obj.chat 			= []; //Chat messages of the room
	room_obj.pl_win 		= -1; //Player, that won the game
	room_obj.current_prices = {crystal: 8, diamond: 16, ladder: 4, torch: 16, supports: 10}; //Current prices of in-game goods
	room_obj.turns 			= turn_count; //Number of turns remaining till the end of the game
	room_obj.room_running 	= false; //Flag, that holds if the game is running

	//Create player array
	room_obj.players = [];

	//Create all player objects
	for(let i = 0; i < player_count; i++) {
		
		room_obj.players[i] = {
			socket: null, //WebSocket of the player
			pnick: null, //Nickname of the player
			money_count: 0, //Player's amount of money
			workers: [], //Player's miners
			action_queue: [], //Queue, that holds actions currently beeing executed
			input_queue: [] //Queue, that holds actions coming over from player
		};
	}
	
	//Save the room
	rooms.set(id, room_obj);
	
	//Return the ID
	return id;
}

//Function, that returns the room object
exports.get_room = function(room_id) {
	return rooms.get(room_id);
}

//Function, that checks, if you can join the room
exports.verify_joinability = function(room_id) {

	//Get the room
	let vroom = rooms.get(room_id);

	//Check, if the room is joinable
	if(vroom === undefined || vroom.spcount == vroom.pcount || vroom.pl_win == -1) return false;
	return true;
}

//Function, that checks, if the room exists
exports.room_exist = function(room_id) {

	//Get the room
	let vroom = rooms.get(room_id);
	
	//If it doesn't exist, return false
	if(vroom === undefined) return false;
	return true;
}

//Function, that stats the game
exports.start_room_clock = function(room) {
	
	//Anounce start of the game
	for(let i = 0; i < room.spcount; i++) {

		//Prepare the room
		room.room_running = true;

		//Send the info about the start of the room to everybody
		room.players[i].socket.send(JSON.stringify({
			type: "game_anouncment",
			content: {
				type: "start",
				prices: room.current_prices,
				id: i
			}
		}));
	}

	//Call RoundTick() every 15 seconds
	setInterval(() => {
		RoundTick(room);
	}, ROUND_TIMER);
}

//Function, that checks, if you can join the room
setInterval(() => {

	//Get all room id's
	let keys = rooms.keys();

	//Iterate through them
	for(let i = 0; i < keys.length; i++){

		//Get the room object
		let room = rooms.get(keys[i]);

		//If the room Expired, close it
		if(room.exp < Date.now()) {

			//Log the closing
			console.log("Room " + keys[i] + " timed out, closing.");

			//Send the info to the players
			for(let j = 0; j < room.pcount; j++) {
				ws.force_conn_end(room.players[i].socket, "Game has ended");
			}

			//Delete the room
			rooms.delete(keys[i]);
		}   
	}
}, 30 * 60 * 1000);
