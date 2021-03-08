const WebSocketServer = require("ws").Server;

let wss = null;

module.exports = function(httpServer){
    wss = new WebSocketServer();

    httpServer.on("upgrade", (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, function(ws) {
            wss.emit("connection", ws, request);
        });
    });



    wss.on("connection", function(ws){

        ws.json = function (data){
			this.send(JSON.stringify(data));
		}

		ws.error = function(description){
			this.send(JSON.stringify({type:"error", message: description}));
		}

        ws.send(JSON.stringify({
            type: "identify-self"
        }));

        socket.on("message", async (msg) => {

            
        });
    });
}