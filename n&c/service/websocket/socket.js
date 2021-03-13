const WebSocketServer = require("ws").Server;
let wss;
const jwt = require("jsonwebtoken");
const url = require("url");
const fs = require("fs");

let users = 0;
const io = require("@pm2/io")

const realtimeUser = io.metric({
  name: "Realtime users (sockets)",
})

realtimeUser.set(0);

let gamesMemory = Object.create(null);
let listeners = Object.create(null);
let sockets = Object.create(null);

setInterval(async () => {
	for (let gameName in gamesMemory){
		let game = gamesMemory[gameName];
		if (game.lastActionTimestamp > game.lastSaveTimestamp){
			let content = {
				player0: game.player0,
				player1: game.player1,
				p0_points: game.p0_points,
				p1_points: game.p1_points,
				lines: game.lines,
				p0_moves: game.p0_moves,
				p1_moves: game.p1_moves,
				lastMove: game.lastMove,
				turn: game.turn,
				playableArea: game.playableArea,
				winCondition: game.winCondition,
				spectable: game.spectable,
				winnerCrown: game.winnerCrown
			};
			await fs.promises.writeFile("./service/storage/games/" + gameName + ".json", JSON.stringify(content), "utf-8");
			game.lastSaveTimestamp = Date.now();
			console.log("Saved game ", gameName, game.lastActionTimestamp, game.lastSaveTimestamp);
		}
		if (Date.now() - game.lastActionTimestamp > 5 * 60 * 1000){
			delete gamesMemory[gameName];
			console.log("unloaded ", gameName, " from memory");
		}
	}
}, 60 * 1000);

module.exports = function(server){
	wss = new WebSocketServer({noServer: true});
	//custom upgrade handler to run socket on port 80 along with the API
	server.on("upgrade", (request, socket, head) => {
		const pathname = url.parse(request.url).pathname;
		if (pathname === "/socket"){
		  	wss.handleUpgrade(request, socket, head, (ws) => {
				wss.emit("connection", ws, request);
			});
		} else {
			socket.destroy();
		}
	});

	wss.on("connection", (socket) => {
		users++;		
		realtimeUser.set(users);		

		socket.json = function (data){
			this.send(JSON.stringify(data));
		}

		socket.error = function(code, description){
			this.send(JSON.stringify({action: "error", code: code, description: description}));
		}

		socket.on("message", async (message) => {
			//parse payload
			let payload;
			try {
				payload = JSON.parse(message);
			} catch (error){
				socket.error("INVALID_JSON", "unable to parse JSON")
				return;
			}

			if (payload.action === "own"){
				//assign an account to a socket
				if (typeof socket.owner === "undefined"){
					const typecheck = checkTypes([payload.token], ["string"]);
					if (typecheck){
						socket.error("WRONG_TYPES", typecheck);
					} else {
						try {
							socket.owner = jwt.verify(payload.token, jwtSecret);

							//log user out if logged elsewhere
							const username = socket.owner.username;
							if (typeof sockets[username] !== "undefined"){
								sockets[username].close();
							}
							sockets[username] = socket;

							console.log(socket.owner, new Date());
							socket.json({action: "logged"});

							//auth successful
						} catch (error){
							console.log(error);
							socket.error("AUTH_FAIL", "Authentication failure");
							//nope
						}
					}
				} else {
					socket.error("OWN_READONLY", "You can 'own' a socket only once");
					//owner is read-only after first assignment
				}
			} else if (typeof socket.owner !== "undefined"){
				switch (payload.action){
					case "newGame":
						newGame(payload, socket);
						break;
					case "gameExists":
						gameExists(payload, socket);
						break;
					case "playerInfo":
						playerInfo(payload, socket);
						break;
					case "playerInfoByID":
						playerInfoByID(payload, socket);
						break;
					case "selfInfo":
						selfInfo(payload, socket);
						break;
					case "joinGame":
						joinGame(payload, socket);
						break;
					case "move":
						move(payload, socket);
						break;
					case "listen":
						listen(payload, socket);
						break;
					case "unlisten":
						unlisten(payload, socket);
						break;
					default:
						//user sent invalid action
						socket.json({action: "error", description: "Unknown action"});
				}
			} else {
				socket.error("NO_AUTH", "Authentication required");
			}
		});
		socket.on("close", () => {
			if (typeof socket.owner !== "undefined"){
				if (typeof socket.listeningTo !== "undefined"){
					let gameListeners = listeners[socket.listeningTo];
					for (let i = 0; i < gameListeners.length; i++){
						if (gameListeners[i] === socket){
							if (gameListeners.length === 1){
								delete listeners[socket.listeningTo];
							} else {
								gameListeners.splice(i, 1);
							}
							break;
						}
					}
				}
				
				const username = socket.owner.username;
				if (sockets[username].readyState === 3){
					delete sockets[username];
				}
				query("UPDATE `users` SET `lastSeen`=? WHERE `ID`=?;", [Date.now(), socket.owner.id]);
			} else {
				console.log("socket closed by unauthenticated");
			}
			users--;		
			realtimeUser.set(users);
		});
	});
}

function loadGameToMemory(name){
	return new Promise((resolve, reject) => {
		fs.readFile("./service/storage/games/" + name + ".json", "utf-8", (err, data) => {
			if (err){
				resolve(false);
			} else {
				let game = JSON.parse(data);
				game.name = name;
				const now = Date.now();
				game.lastActionTimestamp = now;
				game.lastSaveTimestamp = now;
				gamesMemory[name] = game;
				console.log("Loaded " + name + " to memory");
				resolve(true);
			}
		});
	});
}

function checkTypes(values, types){
	for (let i = 0; i < values.length; i++){
		if (typeof values[i] !== types[i]){
			return values[i] + " is supposed to be of type " + types[i] + ", received type " + typeof values[i];
		}
	}
	return false; //string would evaluate to true
}

async function listen(payload, socket){
	const typecheck = checkTypes([payload.game], ["string"]);
	if (typecheck){
		socket.error("WRONG_TYPES", typecheck);
	} else {
		const gameListeners = listeners[socket.listeningTo];
		if (typeof gameListeners !== "undefined"){
			for (let i = 0; i < gameListeners.length; i++){
				if (gameListeners[i] === socket){
					if (gameListeners.length === 1){
						delete listeners[socket.listeningTo];
					} else {
						gameListeners.splice(i, 1);
					}
					break;
				}
			}
		}
		
		
		const game = payload.game;
		
		if (typeof listeners[game] === "undefined"){
			listeners[game] = [];
		}

		listeners[game].push(socket);
		socket.listeningTo = game;
	}
}

async function unlisten(payload, socket){
	const game = socket.listeningTo;
	
	if (typeof game !== "undefined"){
		let gameListeners = listeners[game];
		for (let i = 0; i < gameListeners.length; i++){
			if (gameListeners[i] === socket){
				if (gameListeners.length === 1){
					delete listeners[socket.listeningTo];
				} else {
					gameListeners.splice(i, 1);
				}
				break;
			}
		}

		delete socket.listeningTo;
	}
}

async function move(payload, socket){
	const typecheck = checkTypes([payload.game], ["string"]);
	if (typecheck){
		socket.error("WRONG_TYPES", typecheck);
	} else {
		if (Array.isArray([payload.move])){
			if (! (Number.isSafeInteger(payload.move[0]) && Number.isSafeInteger(payload.move[1]))){
				socket.error("WRONG_TYPES", "move[0] and move[1] are supposed to be of type integer, received types " + typeof payload.move[0] + ", " + typeof payload.move[1]);
				return;
			}
		} else {
			socket.error("WRONG_TYPES", "move is supposed to be of type array, received type " + typeof payload.move);
			return;
		}

		let inMemory = true;
		if (typeof gamesMemory[payload.game] === "undefined"){
			inMemory = await loadGameToMemory(payload.game);
		}

		if (inMemory){
			let game = gamesMemory[payload.game];
			if (game["player" + game.turn] !== socket.owner.id){
				socket.error("NOT_ON_TURN", "Not your turn");
				return;
			}

			if (game.winCondition !== -1){
				if (game.p0_points >= game.winCondition || game.p1_points >= game.winCondition){
					socket.error("GAME_ENDED", "Game already ended");
					return;
				}
			}
			
			const x = payload.move[0];
			const y = payload.move[1];

			if (game.playableArea !== -1){
				if (x < 0 || x > game.playableArea - 1 || y < 0 || y > game.playableArea - 1){
					socket.error("AREA_RESTRICTED", "Out of bounds");
					return;
				}
			}

			let p0_moves = game.p0_moves;
			let p1_moves = game.p1_moves;
			for (let i = 0; i < p0_moves.length; i++){
				if (p0_moves[i][0] === x && p0_moves[i][1] === y){
					socket.error("TILE_FILLED", "Tile already filled");
					return;
				}
			}
			for (let i = 0; i < p1_moves.length; i++){
				if (p1_moves[i][0] === x && p1_moves[i][1] === y){
					socket.error("TILE_FILLED", "Tile already filled");
					return;
				}
			}

			game["p" + game.turn + "_moves"].push([x, y]);
			game.lastMove = [x, y];
			game.lastActionTimestamp = Date.now();
			
			const message = JSON.stringify({
				action: "announceMove",
				game: payload.game,
				player: game.turn,
				move: [x, y]	
			});
			for (const gameListener of listeners[payload.game]){
				gameListener.send(message);
			}



			let directions = [
				[false, false, false, false, true, false, false, false, false],
				[false, false, false, false, true, false, false, false, false],
				[false, false, false, false, true, false, false, false, false],
				[false, false, false, false, true, false, false, false, false]
			];
			const moves = game.turn === 0 ? game.p0_moves : game.p1_moves;

			for (let i = 0; i < moves.length; i++){
				const move = moves[i];
				const x2 = move[0];
				const y2 = move[1];
				if (x === x2){
					const diff = y2 - y;
					if (Math.abs(diff) <= 4){
						directions[3][diff + 4] = true;
					}
				} else if (y === y2){
					const diff = x2 - x;
					if (Math.abs(diff) <= 4){
						directions[1][diff + 4] = true;
					}
				} else {
					const xDiff = x2 - x;
					const yDiff = y2 - y;
					if (Math.abs(xDiff) <= 4 && Math.abs(yDiff) <= 4){
						if (xDiff === yDiff){
							directions[2][xDiff + 4] = true;
						} else if (xDiff === -yDiff){
							directions[0][xDiff + 4] = true;
						}
					}
				}
			}

			const lines = game.lines;
			for (let i = 0; i < lines.length; i++){
				const line = lines[i];
				const xLine = line[0];
				const yLine = line[1];
				const direction = line[2];

				let diff;
				let cont = false;
				switch (direction){
					case 0:
						if (xLine - x === - (yLine - y)){
							diff = xLine - x;
							cont = true;
						}
						break;
					case 1:
						if (yLine === y){
							diff = xLine - x;
							cont = true;
						}
						break;
					case 2:
						if (xLine - x === yLine - y){
							diff = xLine - x;
							cont = true;
						}
						break;
					case 3:
						if (xLine === x){
							diff = yLine - y;
							cont = true;
						}
				}
				
				if (cont){
					if (diff >= -8 && diff <= 4){
						for (let j = diff + 4; j < diff + 9; j++){
							if (j >= 0 && j <= 8){
								directions[direction][j] = false;
							}
						}
					}
				}
			}

			for (let direction = 0; direction < 4; direction++){
				const bools = directions[direction];
				for (let offset = 0; offset < 5; offset++){
					if (bools[offset] && bools[offset + 1] && bools[offset + 2] && bools[offset + 3] && bools[offset + 4]){
						let lineX, lineY;
						switch (direction){
							case 0:
								lineX = x + offset - 4;
								lineY = y - offset + 4;
								break;
							case 1:
								lineX = x + offset - 4;
								lineY = y;
								break;
							case 2:
								lineX = x + offset - 4;
								lineY = y + offset - 4;
								break;
							case 3:
								lineX = x;
								lineY = y + offset - 4;
								break;
						}
						const line = [lineX, lineY, direction];
						game.lines.push(line);
						if (game.turn === 0){
							game.p0_points++;
						} else {
							game.p1_points++;
						}
						const message = JSON.stringify({
							action: "announceLine",
							game: game.name,
							player: game.turn,
							line: line
						});
						for (const gameListener of listeners[game.name]){
							gameListener.send(message);
						}
						if (game.player0 !== game.player1){
							query("UPDATE `users` SET `totalPoints`=totalPoints+1 WHERE `ID`=?;", [game["player" + game.turn]]);
						}
						break;
					}
				}
			}


			if (game.turn === 0){
				game.turn = 1;
			} else {
				game.turn = 0;
			}
		} else {
			socket.error("GAME_NOT_FOUND", "Failed to make the turn, game does not exist");
		}
	}
}

async function joinGame(payload, socket){
	const typecheck = checkTypes([payload.name], ["string"]);
	if (typecheck){
		socket.error("WRONG_TYPES", typecheck);
	} else {
		let loaded = true;
		if (typeof gamesMemory[payload.name] === "undefined"){
			loaded = await loadGameToMemory(payload.name);
		}

		if (loaded){
			const ownerID = socket.owner.id;
			const game = gamesMemory[payload.name];
			if (game.player0 === ownerID || game.player1 === ownerID || game.spectable){
				socket.json({
					action: "joinGame",
					game: game
				});
			} else {
				socket.error("GAME_ACCESS_DENIED", "You do not have a permission to join this game");
			}
		} else {
			socket.error("JOIN_GAME_NOT_FOUND", "Failed to load, game does not exist");
		}
	}
}

async function newGame(payload, socket){
	const typecheck = checkTypes([payload.name, payload.playableArea, payload.winCondition, payload.spectable], ["string", "number", "number", "boolean"]);
	if (typecheck){
		socket.error("WRONG_TYPES", typecheck);
	} else {
		//clear game name of control characters
		payload.name = payload.name.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
		//check for / character (illegal due to filenames)
		if (payload.name.indexOf("/") !== -1){
			socket.error("ILLEGAL_GAME_NAME", "illegal game name, contains /");
		} else if (payload.name === "__proto__"){
			socket.error("ILLEGAL_GAME_NAME", "illegal game name, __proto__ is banned");
		} else if (payload.name.length > 50){
			socket.error("ILLEGAL_GAME_NAME", "name too long, max 50 characters");
		} else {
			fs.promises.access("./service/storage/games/" + payload.name + ".json", fs.constants.R_OK)
			.then(async () => { //game exists
				socket.error("GAME_ALREADY_EXISTS", "Game exists");
			})
			.catch(async () => {
				//game does not exist - create it
				//prepare empty game
				//find other player by name
				const player1 = await query("SELECT `ID`,`username` FROM `users` WHERE `username`=? LIMIT 1;", [payload.player1]);
				if (typeof player1[0] === "undefined"){
					socket.error("OPPONENT_NOT_FOUND", "Other player not found");
					return;
				}
				let content = {
					player0: socket.owner.id,
					player1: player1[0].ID,
					p0_points: 0,
					p1_points: 0,
					lines: [],
					p0_moves: [],
					p1_moves: [],
					lastMove: null,
					turn: 1,
					playableArea: payload.playableArea,
					winCondition: payload.winCondition,
					spectable: payload.spectable,
					winnerCrown: Math.floor(Math.random() * 4)
				};
				//write game to file
				fs.writeFile("./service/storage/games/" + payload.name + ".json", JSON.stringify(content), "utf-8", (error) => {
					if (error) throw error;
					content.name = payload.name;
					socket.json({action: "gameCreated", game: content});
				});

				if (payload.sendInvite){
					sendInvite(socket.owner.username, player1[0].username, payload.name, socket);
				}
			});
		}
		
	}
}


async function gameExists(payload, socket){
	const typecheck = checkTypes([payload.name], ["string"]);
	if (typecheck){
		socket.error("WRONG_TYPES", typecheck);
	} else {
		if (typeof gamesMemory[payload.name] === "undefined"){
			fs.promises.access("./service/storage/games/" + payload.name + ".json", fs.constants.R_OK)
				.then(() => {
					socket.json({
						action: "gameExists",
						name: payload.name,
						exists: true,
						loopback: payload.loopback
					});
				})
				.catch(() => {
					socket.json({
						action: "gameExists",
						name: payload.name,
						exists: false,
						loopback: payload.loopback
					});
				});
		} else {
			socket.json({
				action: "gameExists",
				name: payload.name,
				exists: true,
				loopback: payload.loopback
			});
		}
	}
}


async function playerInfo(payload, socket){
	const typecheck = checkTypes([payload.name], ["string"]);
	if (typecheck){
		socket.error("WRONG_TYPES", typecheck);
	} else {
		const player = await query("SELECT * FROM `users` WHERE `username`=? LIMIT 1;", [payload.name]);
		if (typeof player[0] === "undefined"){
			socket.json({
				action: "playerInfo",
				exists: false,
				loopback: payload.loopback
			});
		} else {
			socket.json({
				action: "playerInfo",
				exists: true,
				id: player[0].ID,
				username: player[0].username,
				color: player[0].color,
				totalPoints: player[0].totalPoints,
				lastSeen: typeof sockets[player[0].username] === "undefined" ? player[0].lastSeen : 0,
				createdAt: player[0].createdAt,
				photoUrl: "./api/photo?user=" + player[0].ID,
				loopback: payload.loopback
			});
		}
	}
}


async function playerInfoByID(payload, socket){
	if (Number.isInteger(payload.ID)){
		const player = await query("SELECT * FROM `users` WHERE `ID`=?;", [payload.ID]);
		if (typeof player[0] === "undefined"){
			socket.json({
				action: "playerInfoByID",
				exists: false,
				loopback: payload.loopback
			});
		} else {
			socket.json({
				action: "playerInfoByID",
				exists: true,
				id: player[0].ID,
				username: player[0].username,
				color: player[0].color,
				totalPoints: player[0].totalPoints,
				lastSeen: typeof sockets[player[0].username] === "undefined" ? player[0].lastSeen : 0,
				createdAt: player[0].createdAt,
				photoUrl: "/api/photo?user=" + player[0].ID,
				loopback: payload.loopback
			});
		}
	} else {
		socket.error("WRONG_TYPES", "ID must be an integer");
	}
}

const photos = [
	"",
	"/client/img/boy1.png",
	"/client/img/boy2.png",
	"/client/img/boy3.png",
	"/client/img/girl1.png",
	"/client/img/girl2.png",
	"/client/img/girl3.png"
];

const photoHints = [
	null,
	"boy1",
	"boy2",
	"boy3",
	"girl1",
	"girl2",
	"girl3"
];

async function selfInfo(payload, socket){
	const player = await query("SELECT * FROM `users` WHERE `ID`=?;", [socket.owner.id]);
	const photoCode = player[0].photo
	socket.json({
		action: "selfInfo",
		id: player[0].ID,
		username: player[0].username,
		email: player[0].email,
		color: player[0].color,
		totalPoints: player[0].totalPoints,
		lastSeen: 0,
		createdAt: player[0].createdAt,
		photoHint: photoHints[photoCode],
		photoUrl: photoCode === 0 ? "/api/photo?user=" + player[0].ID : photos[photoCode],
		loopback: payload.loopback
	});
}


async function sendInvite(fromName, toName, game, socket){
	const target = sockets[toName];
	if (typeof target !== "undefined"){
		target.send(JSON.stringify({
			action: "invite",
			from: fromName,
			game: game
		}))
	}
}