
const http          = require('http');
const crypto        = require('crypto');
const fs            = require('fs');
const url           = require('url'); 
const path          = require('path');

//temp workaround
const room = require('./services/game/room.js');
const { PassThrough } = require('stream');
const { verify_jwt } = require('./services/network/jwt.js');
const { isUndefined } = require('util');


const err403 = "<title>403: Access denied</title><h1>403:</h1>You don't have permision to view this content!";
const err404 = "<title>404: Not Found</title><h1>404:</h1>Unable to fetch ./www";


const server = http.createServer(async (req, res) => {

        if(req.method == 'POST'){
            var body = '';
            req.on('data', function (data) {
                body += data;
            });

            req.on('end', function() {
                var parsedBody = JSON.parse(body);


                switch(parsedBody.type){

                    case "join-room":

                        //setup response
                        res.statusCode = 200;

                        let vroom = room.get_room(parsedBody.room_id); //Room getting verified
                        if(vroom === undefined || vroom.players.length == vroom.pcount) res.end("invalid");
                        
                      
                        
                    break;


                    case "join-token":
                        
                        //setup response
                        res.statusCode = 200;

                        let parsed_token = verify_jwt(parsedBody.token);
                        if(parsed_token === undefined) res.end("invalid"); //if token is invalid, throw err


                        


                    break;

                }


            });
        }
        else{
            let contPath = url.parse(req.url, true).pathname;
            let query = url.parse(req.url, true).query;
            var reqFile = null;

            //if url is in form url.dom/something/, append index.html to loaded path
            if(contPath.lastIndexOf("/") == contPath.length - 1)
                contPath += "index.html"; 

            const normalized = path.normalize(contPath);

            if (normalized.substring(0, 3) === "../" || normalized.substring(0, 2) === "./"){
                res.statusCode = 403;
                res.end(err403);
                return;
            }

            const fstream = fs.createReadStream(path.join("./www", normalized));
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