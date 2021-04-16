//Import libs
const http          = require('http');
const fs            = require('fs');
const url           = require('url'); 
const path          = require('path');
const express 		= require("express");



var app = express();
var router = express.Router();

app.use("/", require("body-parser").json());

router.post("/api/register", require("./api/register"));
router.post("/api/login", require("./api/login"));
router.post("/api/refreshToken", require("./api/refreshToken"));

router.post("/api/auth/newGroup", require("./api/auth/newGroup"));
router.post("/api/auth/joinGroup", require("./api/auth/joinGroup"));
router.post("/api/auth/leaveGroup", require("./api/auth/leaveGroup"));
router.post("/api/auth/loadGroup", require("./api/auth/loadGroup"));
router.post("/api/auth/changeGroupName", require("./api/auth/changeGroupName"));
router.post("/api/auth/changeGroupInviteCode", require("./api/auth/changeGroupInviteCode"));

router.post("/api/auth/getUserInfo", require("./api/auth/getUserInfo"));
router.post("/api/auth/changeName", require("./api/auth/changeName"));

router.post("/api/auth/setTodayEating", require("./api/auth/setTodayEating"));
router.post("/api/auth/setTodayOrdering", require("./api/auth/setTodayOrdering"));
router.post("/api/auth/setTodayRestaurant", require("./api/auth/setTodayRestaurant"));
router.post("/api/auth/setTodayTime", require("./api/auth/setTodayTime"));
router.post("/api/auth/lockGroup", require("./api/auth/lockGroup"));

app.use("/", express.static("./services/frontend"));

app.use("/api/auth/*", require("./util/auth"));

app.use("/", router);


const http = require("http");
const server = http.createServer(app);
server.listen(3000, "0.0.0.0");

//Start the HTTP server
server.listen(6502, "127.0.0.1");

//Start WS listener
require("./services/network/socket.js")(server);