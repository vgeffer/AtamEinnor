
const http          = require('http');
const fs            = require('fs');
const url           = require('url'); 
const path          = require('path');

//temp workaround
const room = require('./services/game/room.js');
const jwt = require('./services/network/jwt.js');

//HTTP error pages
const err403 = "<title>403: Access denied</title><h1>403:</h1>You don't have permision to view this content!";
const err404 = "<title>404: Not Found</title><h1>404:</h1>Unable to fetch ./www";


const server = http.createServer(async (req, res) => {
        
        if(req.method == 'POST'){
            var body = '';
            req.on('data', function (data) {
                body += data;
            });

            req.on('end', async () => {
                var parsedBody = JSON.parse(body);

                let searched_room = null;
                switch(parsedBody.type){

                    case "join-room":

                        //setup response
                        res.statusCode = 200;

                        if(!room.verify_joinability(parsedBody.room_id)) return res.end("invalid");
                        searched_room = room.get_room(parsedBody.room_id.toLowerCase());
                        for(let i = 0; i < searched_room.spcount; i++)
                            if(searched_room.players[i].pnick == parsedBody.nick) return res.end("player_exist");
                        searched_room.players[searched_room.spcount++].pnick = parsedBody.nick;
        
                        res.end(jwt.sign_jwt({
                            nick: parsedBody.nick,
                            room_id: parsedBody.room_id
                        }));

                    break;

                    case "join-token":
                        
                        //setup response
                        res.statusCode = 200;

                        let parsed_token = await jwt.verify_jwt(parsedBody.token);
                        if(parsed_token === undefined) return res.end("invalid"); //if token is invalid, throw err
                        if(!room.room_exist(parsed_token.room_id)) return res.end("invalid");
                        searched_room = room.get_room(parsed_token.room_id);

                        if(searched_room.pl_win != -1) return res.end("invalid");
                        for(let i = 0; i < searched_room.spcount; i++) {
                            if(searched_room.players[i].pnick === parsed_token.nick) return res.end(parsed_token.room_id);
                        }
                        res.end("invalid");
                    break;
                    
                    case "create-room":
                        res.statusCode = 200;
                        console.log(parsedBody.turn_count);
                        res.end(room.create_room(parsedBody.player_count, parsedBody.turn_count));
                    break;
                }


            });
        }
        else {
            let contPath = url.parse(req.url, true).pathname;

            //if url is in form url.dom/something/, append index.html to loaded path
            if(contPath.lastIndexOf("/") == contPath.length - 1)
                contPath += "index.html"; 

            const normalized = path.normalize(contPath);

            if (normalized.substring(0, 3) === "../" || normalized.substring(0, 2) === "./"){
                res.statusCode = 403;
                return res.end(err403);
            }

            if(contPath == "/report") {
                res.writeHead(301, {Location: "https://forms.gle/e3FrMLzG95nF2UdU8"});
                res.end();
                return;
            }

            const fstream = fs.createReadStream(path.join("./services/frontend-code", normalized));
            fstream
            .on("error", (error) => {
                res.statusCode = 404;
                res.end(err404 + contPath);
                
                console.log(error);
            })
            .on("open", () => {
                fstream.pipe(res);
            });
        }
});


server.listen(6502, "127.0.0.1");
require("./services/network/socket.js")(server);