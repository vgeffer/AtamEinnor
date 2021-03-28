const world = require("./world.js");

exports.ParsePlayerAction = function(action, room, nick, ws) {

    //Get player id
    let id = 0;
    for(let i = 0; i < room.pcount; i++) 
        if(room.players[i].pnick == nick) id = i;


    switch (action.type) {

        case "buy-item":
            
            if(room.current_prices[action.item] <= room.players[id].money_count) {
                //Succesful purchase

                room.players[id].workers[action.unitid].inv[action.item]++; //Since you can buy only one per call
                room.players[id].money_count -= room.current_prices[action.item];

                ws.send(JSON.stringify({
                    type: "transaction",
                    status: "success",
                    money: room.players[id].money_count,
                    workers: room.players[id].workers,
                    unitid: action.unitid
                }));

                return;
            }

            //Failed Purchase
            ws.send(JSON.stringify({
                type: "transaction",
                status: "failed"
            }));
            
        break;

        case "sell-item":
            if(room.workers[action.unitid].inv.ores[action.item] >= action.quantity) {
                //Succesful purchase

                room.players[id].workers[action.unitid].inv.ores[action.item] -= action.quantity; //Since you can buy only one per call
                room.players[id].money_count += room.current_prices[action.item];

                ws.send(JSON.stringify({
                    type: "transaction",
                    status: "success",
                    money: room.players[id].money_count,
                    workers: room.players[id].workers,
                    unitid: action.unitid
                }));

                return;
            }

            //Failed Purchase
            ws.send(JSON.stringify({
                type: "transaction",
                status: "failed"
            }));
        break;

        case "use-item":

        break;
    }
}

exports.RoundTick = function(room) {



    for(let i = 0; i < room.spcount; i++) {
        //Parse Queues


    }


    //Generate new prices

    MassSend(room, {
        type: "game_anouncment",
        content: {
            type: "tick_update",
            prices: room.current_prices
        }
    });
}

function MassSend(room, payload){
    for(let i = 0; i < room.spcount; i++) {

        room.room_running = true;
        room.players[i].socket.send(JSON.stringify(payload));
    }
}