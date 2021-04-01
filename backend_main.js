//Import libs
const http          = require('http');
const fs            = require('fs');
const url           = require('url'); 
const path          = require('path');

const room = require('./services/game/room.js');
const jwt = require('./services/network/jwt.js');

//HTTP error pages
const err403 = "<title>403: Access denied</title><h1>403:</h1>You don't have permision to view this content!";
const err404 = "<title>404: Not Found</title><h1>404:</h1>Unable to fetch ./www";

//Create the HTTP server (https handled externaly)
const server = http.createServer(async (req, res) => {
		
		//Parse the POST requests
		if(req.method == 'POST'){
			
			//Get the body of the request
			var body = '';
			req.on('data', function (data) {
				body += data;
			});

			//Send a response
			req.on('end', async () => {
				
				//Parse the body from JSON to JS object
				var parsedBody = JSON.parse(body);

				//Defined here, so I don't get errors
				let searched_room = null;

				switch(parsedBody.type){

					case "join-room":

						//setup response
						res.statusCode = 200;

						//Check, if the new room could be joined. If not, return
						if(!room.verify_joinability(parsedBody.room_id)) return res.end("invalid");

						//If any previous connection exists, destroy it
						let token = await jwt.verify_jwt(parsedBody.token);

						//If the token is valid, disconnect the player
						if (token !== undefined) {

							//Check, if the room still extists
							if(room.room_exist(token.room_id)) {

								//If yes, find the player
								for(let i = 0; i < room.get_room(token.room_id).pcount; i++) {
									if(room.get_room(token.room_id).players[i].pnick == token.nick) { 
										
										//Send a message to a previous game
										await room.get_room(token.room_id).players[i].socket.send(JSON.stringify({
											type: "error",
											message: "New session created, disconnecting..."
										}));

										//Remove the player from the room
										room.get_room(token.room_id).spcount--;
										room.get_room(token.room_id).players[i] = {
											socket: null,
											pnick: null,
											money_count: 0, 
											workers: [],
											action_queue: null,
											input_queue: []
										};
									}
								}
							}
						}

						//Get the room object
						searched_room = room.get_room(parsedBody.room_id.toLowerCase());
						
						//Find first free spot for the player
						for(let i = 0; i < searched_room.pcount; i++){

							//Check, if player with the same nick already exists in the room
							if(searched_room.players[i].pnick == parsedBody.nick) return res.end("player_exist");
							
							//If the free spot is found, save the player
							if(searched_room.players[i].pnick == null) {
						
								//Save player's nick and increase active player count in the room
								searched_room.players[i].pnick = parsedBody.nick;
								searched_room.spcount++;

								//Return player's id to the user
								return res.end(jwt.sign_jwt({
									nick: parsedBody.nick,
									room_id: parsedBody.room_id
								}));
							}   
							
						}
					//If room is full, exit
					return res.end("invalid");

					case "join-token":
		
						//Setup response
						res.statusCode = 200;

						//Check, if supplied token is valid
						let parsed_token = await jwt.verify_jwt(parsedBody.token);
						
						//If token is invalid, throw err
						if(parsed_token === undefined) return res.end("invalid"); 
						
						//Check, if the room still exists
						if(!room.room_exist(parsed_token.room_id)) return res.end("invalid");
						
						//Get the room object
						searched_room = room.get_room(parsed_token.room_id);
						
						//Check, if the game has already ended
						if(searched_room.pl_win != -1) return res.end("invalid");

						//Find the user
						for(let i = 0; i < searched_room.spcount; i++) {
							
							//If found, return params for client to join the room
							if(searched_room.players[i].pnick === parsed_token.nick) return res.end(parsed_token.room_id);
						}

						//If not found, throw an error
						res.end("invalid");
					break;
					
					case "create-room":

						//Setup the response
						res.statusCode = 200;
						
						//Check if player_count and turn_count are numbers
						if(typeof(parsedBody.player_count) !== "number" || typeof(parsedBody.turn_count) !== "number") {
							
							//If not, throw an error
							res.statusCode = 400;
							res.end("bad request. player_count or turn_count is NaN");
							return;
						}

						//Check if values for player_count and turn_count are valid
						if(parsedBody.player_count < 2 || parsedBody.player_count > 6|| parsedBody.turn_count < 1) {

							//If not, throw an error
							res.statusCode = 400;
							res.end("bad request. player_count or turn_count has an invalid value");
							return;
						}

						//If all checks passed, create the room
						res.end(room.create_room(parsedBody.player_count, parsedBody.turn_count * 4));
					break;
				}
			});
		}
		else {
			let contPath = url.parse(req.url, true).pathname;

			//If url is in form url.sth/something/, append index.html to loaded path
			if(contPath.endsWith("/"))
				contPath += "index.html"; 

			//Remove ../ and ./ attacks from content path
			const normalized = path.normalize(contPath);
			if (normalized.startsWith("../") || normalized.startsWith("./")){
				
				//If such attack found, send 403 to the sender
				res.statusCode = 403;
				return res.end(err403);
			}

			//Setup /report redirect to google forms
			if(contPath == "/report") {
				
				//Create redirection header
				res.writeHead(301, {Location: "https://forms.gle/e3FrMLzG95nF2UdU8"});
				
				//Send the response
				return res.end();
			}

			//Create async file stream
			const fstream = fs.createReadStream(path.join("./services/frontend-code", normalized));

			//Read the file from the disk
			fstream
			.on("error", (error) => {
				
				//If any error occured, return 404
				res.statusCode = 404;
				res.end(err404 + contPath);
				
				//console.log(error);
			})
			.on("open", () => {

				//If the opening succeeded, send the file to user
				fstream.pipe(res);
			});
		}
});

//Start the HTTP server
server.listen(6502, "127.0.0.1");

//Start WS listener
require("./services/network/socket.js")(server);