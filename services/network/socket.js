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

        console.log("user connected");

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
                    let parsed_token = await jwt.verify_jwt(payload.content);
                    if (parsed_token === undefined) return ws.json({type: "auth_response", content: "failed"});

                    usr_nick = parsed_token.nick;
                    current_room_code = parsed_token.room_id;
                    current_room = room.get_room(parsed_token.room_id);


                    //assign socket
                    for(let i = 0; i < current_room.pcount; i++) {
                        if(current_room.players[i].pnick == usr_nick) {
                            console.log(current_room);
                            current_room.players[i].socket = ws;
                            ws.json({type: "auth_response", content: "success"});
                            return;
                        }
                    }
                    ws.json({type: "auth_response", content: "failed"});
                break;

                case "check_host_privileges":
                    if(current_room != null) {
                        if(usr_nick === current_room.players[0].pnick)
                            ws.json({type: "response", content: "true"});
                        else
                            ws.json({type: "response", content: "false"});
                    }
                break;

                case "host_action":
                break;

                case "player_action":
                    if(current_room != null) {
                        player.ParsePlayerAction(parsed_token.content, current_room, ws);
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