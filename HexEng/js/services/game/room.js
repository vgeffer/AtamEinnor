const crypto = require('crypto');

let rooms = new Map();

exports.create_room = function(player_count) {

    let id = "";
    let room_obj = {};

    do {
        id = crypto.randomBytes(4).toString('hex');
    } while(rooms.has(id));

    /*CREATE ROOM OBJ*/
    room_obj.pcount = player_count;
    room_obj.seed = crypto.randomBytes(16);
    room_obj.spcount = 0;
    room_obj.lifetime = 60;
    room_obj.world = null;

    //Create all room objs
    for(let i = 0; i < player_count; i++) {
        room_obj.players[i] = {
            socket: null,
            pnick: null
        };
    }
    
    rooms.set(id, room_obj);
}

exports.get_room = function(room_id) {
    return rooms.get(room_id);
}