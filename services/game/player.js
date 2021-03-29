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
            if(room.players[id].workers[action.unitid].inv.ores[action.item] >= action.quantity) {
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

        case "move-player":
        
        break;

        case "dig-burry-me":

        break;

        case "gather-ore":

        break;
    }
}

exports.RoundTick = function(room) {


    if(!room.room_running) return;
    room.turns--;

    
    if(room.turns == 0) {
        //End Game Handler
        let max_coins = -1;
        let max_id = -1;

        for(let i = 0; i < room.spcount; i++) {
            
            if(room.players[i].money_count > max_coins) {
                max_id = i;
                max_coins = room.players[i].money_count;
            }
        }

        room.pl_win = max_id;
        room.room_running = false;
        MassSend(room, {
            type: "game_anouncment",
            content: {
                type: "game_end",
                winner_nick: room.players[max_id].pnick,
                coins: max_coins
            }
        });

        return;
    }

    for(let i = 0; i < room.spcount; i++) {
        //Parse Queues


    }


    //Generate new prices
    room.current_prices = {
        crystal: randomIntFromInterval(8, 32), 
        diamond: randomIntFromInterval(12, 48), 
        ladder: randomIntFromInterval(4, 24), 
        torch: randomIntFromInterval(4, 32), 
        supports: randomIntFromInterval(8, 16)
    } 

    //Gather Entity data
    let entityData = [];

    for(let i = 0; i < room.spcount; i++) {
        entityData[i] = [];
        for(let u = 0; u < room.players[i].workers.length; u++){
            entityData[i][u] = {
                type: room.players[i].workers[u].type,
                action: room.players[i].workers[u].a,
                tx: room.players[i].workers[u].tx,
                ty: room.players[i].workers[u].ty
            };
        }
    }


    MassSend(room, {
        type: "game_anouncment",
        content: {
            type: "tick_update",
            prices: room.current_prices,
            ticks: room.turns,
            turns: Math.ceil(room.turns / 4),
            world: room.world,
            ent_data: entityData
        }
    });
}

function MassSend(room, payload){
    for(let i = 0; i < room.spcount; i++) {

        room.room_running = true;
        room.players[i].socket.send(JSON.stringify(payload));
    }
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}


async function ApplyDeltasAsync(queue, room, id) {

}