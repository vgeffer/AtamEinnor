//Import libs
const http          = require('http');
const express 		= require('express');
const game          = require('./services/game/game.js');


var app = express();
var router = express.Router();

app.use("/", require("body-parser").json());

router.post("/api/newGame", game.new);
router.post("/api/joinGame", game.join);



app.use("/", express.static("./services/frontend"));
app.use("/", router);


const http = require("http");
const server = http.createServer(app);

//Start the HTTP server
server.listen(6502, "127.0.0.1");

//Start WS listener
require("./services/network/socket.js")(server);