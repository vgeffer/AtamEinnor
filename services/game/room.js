const crypto = require('crypto');
const world = require('./../game/world.js');
const ws = require('./../network/socket.js');
const { RoundTick } = require('./player.js');
let rooms = new Map();



//ROUND TIME
const ROUND_TIMER = 15 * 1000; //in ms
//----------


exports.create_room = function(player_count, turn_count) {

    let id = "";
    let room_obj = {};

    do {
        id = crypto.randomBytes(4).toString('hex').toLowerCase();
    } while(rooms.has(id));

    /*CREATE ROOM OBJ*/
    room_obj.pcount = player_count;
    room_obj.spcount = 0;
    room_obj.exp = Date.now() + 12 * 60 * 60 * 1000; //12 hours lifetime
    room_obj.world = world.generate_world(32, 32, crypto.randomBytes(4).readUInt32BE());
    room_obj.chat = [];
    room_obj.pl_win = -1;
    room_obj.turns = turn_count;
    room_obj.room_running = false;
    room_obj.player_queue = new Map(); //So one parsing step would be skipped, sorted while comming in

    //Create all room objs
    room_obj.players = [];
    for(let i = 0; i < player_count; i++) {
        room_obj.players[i] = {
            socket: null,
            pnick: null,
            money_count: 0, 
            workers: []
        };
    }
    
    rooms.set(id, room_obj);
    return id;
}

exports.get_room = function(room_id) {
    return rooms.get(room_id);
}

exports.verify_joinability = function(room_id) {
    let vroom = rooms.get(room_id);
    if(vroom === undefined || vroom.spcount == vroom.pcount) return false;
    return true;
}

exports.room_exist = function(room_id) {
    let vroom = rooms.get(room_id);
    if(vroom === undefined) return false;
    return true;
}


exports.start_room_clock = function(room) {
    //Anounce start of the game
    for(let i = 0; i < room.spcount; i++) {

        room.room_running = true;
        room.players[i].socket.send(JSON.stringify({
            type: "game_anouncment",
            content: {
                type: "start"
            }
        }));
    }
    setInterval(() => {
        RoundTick(room);
    }, ROUND_TIMER);
}


setInterval(() => {
    let keys = rooms.keys();

    for(let i = 0; i < keys.length; i++){
        let room = roms.get(keys[i]);
        if(room.exp < Date.now()) {
            console.log("Room " + keys[i] + " timed out, closing.")
            for(let j = 0; j < room.pcount; j++) {
                ws.force_conn_end(room.players[i].socket, "Game has ended");
            }
            rooms.delete(keys[i]);
        }   
    }
}, 30 * 60 * 1000);
