
function CreateWebSocket() {

	socket = new WebSocket(`${(location.protocol === "https:" ? "wss:" : "ws:")}//${location.host}`);
	socket.addEventListener("open", (event) => {
		socket.send(JSON.stringify({
			type: "id_response",
			content: window.localStorage.getItem('LOGTOKEN')
		}));
	});

	socket.addEventListener("message", (event) => {
		console.log("Message from The Server ", event.data);
		
        const payload = JSON.parse(event.data);
		switch (payload.type){

            case "chat_data":
                for(var i = 0; i < payload.content.length; i++) {
                    DisplayChatMessage(payload.content[i].nick, payload.content[i].message);
                }
            break;

            case "new_msg":
                DisplayChatMessage(payload.nick, payload.message);
            break;

			case "auth_response":
				if(payload.content != "success") {
                    socket.close(); //Verification failed, close the communication
                    window.location = window.location;
                }    

                socket.send(JSON.stringify({
                    type: "load_messages"
                }));
            break;

            case "ask_for_start":
                $("StartGameQuestionText").textContent = "Start the game? " + payload.spcount + "/" + payload.pcount + "  players already connected."; 
                OpenPopup("StartGameQuestionContainer");
            break;

            case "game_anouncment":
                
                switch(payload.content.type) {
                    case "start":
                        ClosePopup("StartGameQuestionContainer");
                        ClosePopup("WaitingText");
                    break;
                }

            break;

            case "workers":
                ClosePopup('CharSelectContainer');
                Workers = payload.content;
            break;

            case "world":
                World = payload.content;
                console.log(World);
                break;

            case "close":
                socket.close();
                HandleError(payload.reason);
            break;

			case "error":
                socket.close();
				HandleError(payload.reason);
			break;
		}
	});
}

function RequestChunk(x, y) {
    socket.send(JSON.stringify({
        type: "player_action",
        content: {
            type: "load-chunk",
            position: {X: x, Y: y}
        }
    }));
}

function JoinGame() {

    if (document.getElementById('JoinNick').value == "") return;


    document.getElementById('JoinCode').disabled = true;
    document.getElementById('JoinNick').disabled = true;

    var gameID = document.getElementById('JoinCode').value;

    //Check if ID is valid
    if(gameID.length != 8) {
        document.getElementById('JoinCode').style = "color: red;";
        document.getElementById('JoinCode').disabled = false;
        document.getElementById('JoinNick').disabled = false;
        return;
    }

    //Check, if the code exists
    fetch('', {
        method: 'POST',
        body: JSON.stringify({
            type: 'join-room',
            room_id: gameID,
            nick: document.getElementById('JoinNick').value
        })
    }).then(function(res){

        if(res.status != 200){
			document.getElementById('JoinCode').disabled = false;
			document.getElementById('JoinNick').disabled = false;
			return console.error("MALFORMED REQUEST RECIVED BY SERVER!");
		} 
		
        res.text().then(function(text){
            if(text == "invalid") {                     
                document.getElementById('JoinCode').style = "color: red;";
                document.getElementById('JoinCode').disabled = false;
                document.getElementById('JoinNick').disabled = false;
                return;
            }
            else if(text == "player_exist"){
                document.getElementById('JoinNick').style = "color: red;";
                document.getElementById('JoinCode').disabled = false;
                document.getElementById('JoinNick').disabled = false;
                return;
            }
            else {

                document.getElementById('JoinNick').style = "color: green;";
                document.getElementById('JoinCode').style = "color: green;";

                window.localStorage.setItem('LOGTOKEN', text);
                setTimeout(() => {
                    ClosePopup("Menu");
                    OpenPopup("Game");
                    StartGame(gameID);
                }, 1000);
            }
        });
    });
}

function JoinGameJWT() {

    fetch('', {
        method: 'POST',
        body: JSON.stringify({
            type: 'join-token',
            token: window.localStorage.getItem('LOGTOKEN')
        })
    }).then(function(res) {
        if(res.status != 200){
            $("RejoinButton").style = "color: red;";
            setTimeout(() => {
                $("RejoinButton").disabled = true;
                $("RejoinButton").style = "";
            }, 1000);
            return console.error("MALFORMED REQUEST RECIVED BY SERVER!");
        } 

        res.text().then(function(text){
            
            if(text == "invalid") { 
                $("RejoinButton").style = "color: red;";
                setTimeout(() => {
                    $("RejoinButton").disabled = true;
                    $("RejoinButton").style = "";
                }, 1000);
                return;
            }
            else {
                $("RejoinButton").style = "color: green;";

                setTimeout(() => {
                    ClosePopup("Menu");
                    OpenPopup("Game");
                    StartGame(text);
                }, 1000);
            }
            return;
        });
    });
}

function JWTAutoReconnect() {
    
    fetch('', {
        method: 'POST',
        body: JSON.stringify({
            type: 'join-token',
            token: window.localStorage.getItem('LOGTOKEN')
        })
    }).then(function(res) {
        if(res.status != 200){
            return console.error("MALFORMED REQUEST RECIVED BY SERVER!");
        } 

        res.text().then(function(text){
            
            if(text == "invalid") { 
                return;
            }
            else {
                ClosePopup("Menu");
                OpenPopup("Game");
                StartGame(text);
            }
            return;
        });
    });
}

async function JWTPing() {
    return new Promise((resolve, reject) => {
        fetch('', {
            method: 'POST',
            body: JSON.stringify({
                type: 'join-token',
                token: window.localStorage.getItem('LOGTOKEN')
            })
        }).then(function(res) {
            if(res.status != 200){
                console.error("MALFORMED REQUEST RECIVED BY SERVER!");
                return resolve(false);
            } 

            res.text().then(function(text) {
            
                if(text == "invalid") return resolve(false);
                else return resolve(true);
            });
        });
    });
}

function CreateGame() {

    if (document.getElementById('CreateNick').value == "") return;

    document.getElementById('CreatePlayerCount').disabled = true;
    document.getElementById('CreateTurnCount').disabled = true;
    document.getElementById('CreateNick').disabled = true;


    let gameID = "";

    fetch('', {
        method: 'POST',
        body: JSON.stringify({
            type: 'create-room',
            player_count: document.getElementById('CreatePlayerCount').value,
            turn_count: document.getElementById('CreateTurnCount').value
        })
    }).then(function(res) {
        if(res.status != 200){
            document.getElementById('CreatePlayerCount').disabled = false;
            document.getElementById('CreateTurnCount').disabled = false;
            document.getElementById('CreateNick').disabled = false;
            return console.error("MALFORMED REQUEST RECIVED BY SERVER!");
        } 

        res.text().then(function(text){
            gameID = text;
            console.log(text);
        }).then( () => {

            //Check, if the code exists
            fetch('', {
                method: 'POST',
                body: JSON.stringify({
                    type: 'join-room',
                    room_id: gameID,
                    nick: document.getElementById('CreateNick').value
                })
            }).then(function(res){
    
                if(res.status != 200){
                    document.getElementById('CreatePlayerCount').disabled = false;
                    document.getElementById('CreateTurnCount').disabled = false;
                    document.getElementById('CreateNick').disabled = false;
                    return console.error("MALFORMED REQUEST RECIVED BY SERVER!");
                } 
    
            
                res.text().then(function(text){
                    if(text == "invalid") {
                        document.getElementById('CreatePlayerCount').disabled = false;
                        document.getElementById('CreateTurnCount').disabled = false;
                        document.getElementById('CreateNick').disabled = false;
                        return;
                    }
                    else {
						document.getElementById('CreateNick').style = "color: green;";		

                        window.localStorage.setItem('LOGTOKEN', text);
                        setTimeout(() => {
                            ClosePopup("Menu");
                            OpenPopup("Game");
                            StartGame(gameID);
                        }, 1000);
                    }
                });
            });
        });
    });
}