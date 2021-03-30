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


    if(room.pl_win != -1) return;
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

    //Update World & Players
    let cover_deltas = [];
    let ore_deltas = [];
    let entityData = [];


    for(let i = 0; i < room.spcount; i++) {
        //Parse Queues
            
        //So no errors would be thrown
        let block = null;
        let side = null;
        let unit_id = null;

        switch(room.players[i].action_queue.type) {
            case "dig":
                //get the block and the side that's beeing dug
                block = room.world.covers[room.players[i].action_queue.y * room.world.size_x + room.players[i].action_queue.x];
                side = room.players[i].action_queue[j].side;

                //check if the block has already been mined
                if(block.walls[side] === 0) break;

                //if not, subtract durability
                block.walls[side]--;

                //save the delta
                cover_deltas.push({
                    x: room.players[i].action_queue.x,
                    y: room.players[i].action_queue.y,
                    cover: block
                });
            break;

            case "move":
                //swap position and target variables
                unit_id = room.players[i].action_queue.uid;
                    
                room.players[i].workers[unit_id].x = room.players[i].workers[uint_id].tx;
                room.players[i].workers[unit_id].y = room.players[i].workers[uint_id].ty;

            break;

            case "collect":
                //get the block and the side that's beeing dug
                block = room.world.ores[room.players[i].action_queue.y * room.world.size_x + room.players.action_queue.x];
                unit_id = room.players[i].action_queue.uid;

                //check, if it has ores
                if(!block.ore) break;

                //if yes, how many & what type
                    let ore_count = 0;
                    let ore_type = block.type;

                    //count the ores
                    for(let k = 0; k < 7; k++) 
                        if(block.walls[k] === 1) 
                            ore_count++;

                    //remove them from the world
                    block.walls = [0,0,0,0,0,0,0];

                    //add them to unit's inventory
                    room.players[i].workers[unit_id].inv.ores[ore_type == 0 ? "crystal" : "diamond"] += ore_count;

                    //save the delta
                    ore_deltas.push({
                        x: room.players[i].action_queue.x,
                        y: room.players[i].action_queue.y,
                        ore: block
                    });
                break;

            case "use":
                    

            break;
        }

    }

    //Swap the queues
    for(let i = 0; i < room.spcount; i++) {



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
            cdeltas: cover_deltas,
            odeltas: ore_deltas,
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