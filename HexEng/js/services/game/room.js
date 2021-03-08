const crypto = require('crypto');

let rooms = new Map();

exports.create_room = function(player_count) {

    let id = "";
    let room_obj = {};

    do {
        id = crypto.randomBytes(4).toString('hex').toLowerCase();
    } while(rooms.has(id));

    /*CREATE ROOM OBJ*/
    room_obj.pcount = player_count;
    room_obj.seed = crypto.randomBytes(16);
    room_obj.spcount = 0;
    room_obj.exp = Date.now() + 12 * 60 * 60 * 1000; //12 hours lifetime
    room_obj.world = null;



    //Create all room objs
    room_obj.players = [];
    for(let i = 0; i < player_count; i++) {
        room_obj.players[i] = {
            socket: null,
            pnick: null
        };
    }
    
    rooms.set(id, room_obj);
    return id;
}

exports.get_room = function(room_id) {
    return rooms.get(room_id);
}

exports.verify_room = function(room_id) {
    let vroom = rooms.get(room_id);
    if(vroom === undefined || vroom.spcount == vroom.pcount) return false;
    return true;
}


setInterval(() => {
    let keys = rooms.keys();

    for(let i = 0; i < keys.length; i++){
        let room = roms.get(keys[i]);
        if(room.exp < Date.now()) {
            for(let j = 0; j < room.pcount; j++) {
                //socket.force_conn_end(room.players[i].socket, "Game has ended");
            }
            rooms.delete(keys[i]);
        }   
    }
}, 30 * 60 * 1000);
