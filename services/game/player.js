const world = require("./world.js");

exports.ParsePlayerAction = function(action, room, ws) {

    switch (action.type) {

        case "load-chunk": 

            let chunk = world.generate_chunk();

            ws.send({
                
            });
        break;

        case "buy-item":
            
        break;

        case "sell-item":

        break;

        case "use-item":

        break;
    }
}

exports.RoundTick = function(room) {



    for(let i = 0; i < room.spcount; i++) {
        //Parse Queues


    }



    MassSend(room, {
        type: "game_anouncment",
        content: {
            type: "tick_update"
        }
    });
}

function MassSend(room, payload){
    for(let i = 0; i < room.spcount; i++) {

        room.room_running = true;
        room.players[i].socket.send(JSON.stringify(payload));
    }
}