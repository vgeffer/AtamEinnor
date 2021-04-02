//Import libs
const WebSocketServer = require("ws").Server;
const jwt = require("./jwt.js");
const room = require("./../game/room.js");
const player = require("./../game/player.js");

//Create WebSocket Server
let wss = null;

//Function, that creates and handles WebSocket
module.exports = function(httpServer){

    //If given HTTP server doesn't exist, exit
    if(httpServer == null) return;

    //Create new WebSocket Server
    wss = new WebSocketServer({noServer: true});

    //Handle user's attempt to connect
    httpServer.on("upgrade", (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, function(ws) {
            wss.emit("connection", ws, request);
        });
    });

    //Define variables used across the code
    let usr_nick = "";
    let current_room = null;
    let parsed_token = null;

    //Log the socket closing
    wss.on("close", function() {

    });

    //Handle user's connection
    wss.on("connection", function(ws){

        //Function, that will parse and send object
        ws.json = function (data){
			this.send(JSON.stringify(data));
		}

        //Function, that will send an error to user
		ws.error = function(description){
			this.send(JSON.stringify({type: "error", message: description}));
		}
        
        //Handle incoming message
        ws.on("message", async (msg) => {

            //Parse the payload from JSON to JS object
            let payload = {};
            try{
                payload = JSON.parse(msg);
            } catch(e){
                //If JSON is invalid, exit
                return;
            }

            //Handle message
            switch (payload.type) {
                
                //Load All Chat Messages
                case "load_messages":

                    //If you are joined in room, send the room's chat
                    if (current_room != null) {
                        ws.json({type: "chat_data", content: current_room.chat});
                    }
                break;

                //Save chat message
                case "send_message":

                    //If message is invalid, exit
                    if (typeof(payload.content) != "string") return;

                    //If you are joined in room, save the message
                    if (current_room != null) {
                        current_room.chat.push({
                            nick: usr_nick,
                            message: payload.content
                        });


                        //Send the message update to every player in the room
                        for(let i = 0; i < current_room.spcount; i++) {
                            current_room.players[i].socket.send(JSON.stringify({
                                type: "new_msg",
                                nick: usr_nick,
                                message: payload.content
                            }));
                        }                 
                    }
                break;


                //Identify user
                case "id_response":

                    //Check, if user's JWT is valid
                    parsed_token = await jwt.verify_jwt(payload.content);
                    if (parsed_token === undefined) return ws.json({type: "auth_response", content: "failed"});

                    //Get user's nick and room code from JWT
                    usr_nick = parsed_token.nick;
                    current_room_code = parsed_token.room_id;
                    
                    //Get the room user's trying to connect to
                    current_room = room.get_room(parsed_token.room_id);

                    //Log connection
                    console.log("User " + usr_nick + " connected to room " + parsed_token.room_id);

                    //Assign socket to user
                    for(let i = 0; i < current_room.pcount; i++) {
                        
                        //Get the player's id
                        if(current_room.players[i].pnick == usr_nick) {
                            
                            //Assign socket to player
                            current_room.players[i].socket = ws;

                            //Send Auth response to user
                            ws.json({type: "auth_response", content: "success"});

                            //Send World to user
                            ws.json({type: "world", content: current_room.world});

                            //If player is rejoining, send his assigned workers
                            if(current_room.players[i].workers.length > 0) 
                                ws.json({type: "workers", content: current_room.players[i].workers});
                            
                            //If the game is running, send the anouncment
                            if(current_room.room_running){
                                ws.json({
                                    type: "game_anouncment",
                                    content: {
                                        type: "start",
                                        prices: current_room.current_prices,
                                        id: i
                                    }
                                });
                            }
                            
                            return;
                        }
                    }

                    //If token is invalid, send auth response
                    ws.json({type: "auth_response", content: "failed"});
                break;

                //Question about starting the game, if 2/3 of the user's already connected
                case "host_start_game":
                
                    //Check, if given token is valid
                    parsed_token = await jwt.verify_jwt(payload.content);
                    if(parsed_token === undefined) return;

                    //Check, if the user sending this response is the host
                    if(parsed_token.nick == current_room.players[0].pnick) {
                        
                        //Start the game
                        room.start_room_clock(current_room);
                    }
                break;

                //Handle player input
                case "player_action":

                    //Check, if the player is connected
                    if(current_room != null && typeof(payload.content) != "undefined") {
                        
                        //if yes, parse the action
                        player.ParsePlayerAction(payload.content, current_room, usr_nick, ws);
                    }
                break;

                //Save the player's workers
                case "save_workers":

                    //Check the type of input
                    if (typeof(payload.dcount) == "number" && typeof(payload.gcount) == "number") return;

                    //Get the player id
                    for (let i = 0; i < current_room.pcount; i++) {

                        //Save the workers
                        if (current_room.players[i].pnick == usr_nick) {
                            for (let g = 0; g < payload.gcount; g++)
                                current_room.players[i].workers.push({type: "gnome", x: 0, y: 0, tx: 0, ty: 0, dir: 0, a: 0, inv: {torch: 0, supports: 0, ladder: 0, ores: {crystal: 0, diamond: 0}}});
                            for (let d = 0; d < payload.dcount; d++) 
                                current_room.players[i].workers.push({type: "dwarf", x: 0, y: 0, tx: 0, ty: 0, dir: 0, a: 0, inv: {torch: 0, supports: 0, ladder: 0, ores: {crystal: 0, diamond: 0}}});
                     
                            //Inform the players
                            ws.json({type: "workers", content: current_room.players[i].workers});
                            break;
                        }
                    }

                    //Check, if the room is running
                    if (!current_room.room_running) {

                        //If not, check if it could be started
                        if (current_room.spcount == current_room.pcount) {
                            room.start_room_clock(current_room);
                        }

                        //If not, check if atleast 2/3 of the players have alredy joined
                        else if (current_room.spcount >= 2 * (current_room.pcount / 3)) {
                            
                            //If yes, ask the host, if the game could be started
                            current_room.players[0].socket.send(
                                JSON.stringify({
                                    type: "ask_for_start",
                                    spcount: current_room.spcount,
                                    pcount: current_room.pcount
                                })
                            );
                        }
                    }
                break;

                //If any unknown command is recived, throw an error
                default:
                    ws.error("payload type unknown:" + payload.type);
                break;
            }

        });
    });
}


//Force close the socket with an error
exports.force_conn_end = function(socket, msg){
    socket.send(
        JSON.parse({
            type: "close",
            reason: msg
        })
    );
}
