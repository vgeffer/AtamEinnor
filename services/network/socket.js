const WebSocketServer = require("ws").Server;
const jwt = require("./jwt.js");
const room = require("./../game/room.js");
const player = require("./../game/player.js");

let wss = null;

module.exports = function(httpServer){
    if(httpServer == null) return;
    wss = new WebSocketServer({noServer: true});

    httpServer.on("upgrade", (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, function(ws) {
            wss.emit("connection", ws, request);
        });
    });

    wss.on("connection", function(ws){

        let usr_nick = "";
        let current_room = null;
        let parsed_token = null;

        ws.json = function (data){
			this.send(JSON.stringify(data));
		}

		ws.error = function(description){
			this.send(JSON.stringify({type:"error", message: description}));
		}
        
        ws.on("message", async (msg) => {

            let payload = {};
            try{
                payload = JSON.parse(msg);
            } catch(e){
                return;
            }

            switch(payload.type){
                case "load_messages":
                    if (current_room != null) {
                        ws.json({type: "chat_data", content: current_room.chat});
                    }
                break;

                case "send_message":
                    if (current_room != null) {
                        current_room.chat.push({
                            nick: usr_nick,
                            message: payload.content
                        });

                        for(let i = 0; i < current_room.spcount; i++) {
                            current_room.players[i].socket.send(JSON.stringify({
                                type: "new_msg",
                                nick: usr_nick,
                                message: payload.content
                            }));
                        }                 
                    }
                break;

                case "id_response":
                    parsed_token = await jwt.verify_jwt(payload.content);
                    if (parsed_token === undefined) return ws.json({type: "auth_response", content: "failed"});

                    usr_nick = parsed_token.nick;
                    current_room_code = parsed_token.room_id;
                    current_room = room.get_room(parsed_token.room_id);

                    console.log("User " + usr_nick + " connected to room " + parsed_token.room_id);

                    //assign socket
                    for(let i = 0; i < current_room.pcount; i++) {
                        if(current_room.players[i].pnick == usr_nick) {
                            console.log(i);
                            current_room.players[i].socket = ws;
                            ws.json({type: "auth_response", content: "success"});
                            ws.json({type: "world", content: current_room.world});

                            if(current_room.players[i].workers.length > 0) 
                                ws.json({type: "workers", content: current_room.players[i].workers});
                            
                            if(current_room.room_running){
                                ws.json({
                                    type: "game_anouncment",
                                    content: {
                                        type: "start",
                                        prices: current_room.current_prices
                                    }
                                });
                            }
                            
                            return;


                        }
                    }
                    ws.json({type: "auth_response", content: "failed"});
                break;

                case "host_start_game":
                    parsed_token = await jwt.verify_jwt(payload.content);
                    if(payload.nick == current_room.players[0].pcount) {
                        room.start_room_clock(current_room);
                    }
                break;

                case "player_action":
                    if(current_room != null) {
                        player.ParsePlayerAction(payload.content, current_room, usr_nick, ws);
                    }
                break;

                case "save_workers":
                    for(let i = 0; i < current_room.pcount; i++) {
                        if(current_room.players[i].pnick == usr_nick) {
                            console.log(i);
                            for(let g = 0; g < payload.gcount; g++)
                                current_room.players[i].workers.push({type: "gnome", inv: {torch: 0, supports: 0, ladder: 0, ores: {crystal: 0, diamond: 0}}});
                            for(let d = 0; d < payload.dcount; d++) 
                                current_room.players[i].workers.push({type: "dwarf", inv: {torch: 0, supports: 0, ladder: 0, ores: {crystal: 0, diamond: 0}}});
                     
                            
                            ws.json({type: "workers", content: current_room.players[i].workers});
                            console.log(current_room.players[i].workers);
                            break;
                        }
                    }

                    if(current_room.spcount == current_room.pcount) {
                        room.start_room_clock(current_room);
                    }

                    else if(current_room.spcount >= 2 * (current_room.pcount / 3)) {
                        current_room.players[0].socket.send(
                            JSON.stringify({
                                type: "ask_for_start",
                                spcount: current_room.spcount,
                                pcount: current_room.pcount
                            })
                        );
                    }
                break;

                default:
                    ws.error("payload type unknown:" + payload.type);
                break;
            }

        });
    });
}



exports.force_conn_end = function(socket, msg){
    socket.send(
        JSON.parse({
            type: "close",
            reason: message
        })
    );
}
