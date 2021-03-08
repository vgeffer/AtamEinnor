
function OpenPopup(popupid) {
    document.getElementById(popupid).classList.remove('hidden');
}

function ClosePopup(popupid) {
    document.getElementById(popupid).classList.add('hidden');
}

function JoinGame() {

    if (document.getElementById('jgnick').value == "") return;

    //Hide all messages
    document.getElementById('jerr').classList.add('hidden');
    document.getElementById('jser').classList.add('hidden');
    document.getElementById('jsuc').classList.add('hidden');

    document.getElementById('join_code').disabled = true;
    document.getElementById('jgnick').disabled = true;

    
    var gameID = document.getElementById('join_code').value;

    //Check if ID is valid
    if(gameID.length != 8) {
        document.getElementById('jerr').classList.remove('hidden');
        setTimeout(()=> {
            document.getElementById('jerr').classList.add('hidden');
        }, 5000);

        document.getElementById('join_code').disabled = false;
        document.getElementById('jgnick').disabled = false;
        return;
    }

    //Show 'SEARCHING...' text
    document.getElementById('jser').classList.remove('hidden');

    //Check, if the code exists
    fetch('', {
        method: 'POST',
        body: JSON.stringify({
            type: 'join-room',
            room_id: gameID,
            nick: document.getElementById('jgnick').value
        })
    }).then(function(res){

        if(res.status != 200) return console.error("MALFORMED REQUEST RECIVED BY SERVER!"); 
        
        res.text().then(function(text){
            if(text == "invalid") {
                document.getElementById('jser').classList.add('hidden');
                document.getElementById('jerr').classList.remove('hidden');
                        
                setTimeout(()=> {
                    document.getElementById('jerr').classList.add('hidden');
                }, 5000);

                document.getElementById('join_code').disabled = false;
                document.getElementById('jgnick').disabled = false;
                return;
            }
            else {
                document.getElementById('jser').classList.add('hidden');
                document.getElementById('jsuc').classList.remove('hidden');


                window.localStorage.setItem('LOGTOKEN', text);
                setTimeout(() => {
                    ClosePopup("Menu");
                    OpenPopup("Game");
                }, 1000);
            }
        });
    });
}


function CreateGame() {

    if (document.getElementById('ngnick').value == "") return;

    //Hide all messages
    document.getElementById('nerr').classList.add('hidden');
    document.getElementById('nser').classList.add('hidden');
    document.getElementById('nsuc').classList.add('hidden');

    document.getElementById('player_count').disabled = true;
    document.getElementById('ngnick').disabled = true;


    
    //Show 'SEARCHING...' text
    document.getElementById('nser').classList.remove('hidden');

    let gameID = "";

    fetch('', {
        method: 'POST',
        body: JSON.stringify({
            type: 'create-room',
            player_count: document.getElementById('player_count').value
        })
    }).then(function(res) {
        if(res.status != 200){
            document.getElementById('nerr').classList.remove('hidden');
            document.getElementById('player_count').disabled = false;
            document.getElementById('ngnick').disabled = false;
            setTimeout(()=> {
                document.getElementById('nerr').classList.add('hidden');
            }, 5000);
            return console.error("MALFORMED REQUEST RECIVED BY SERVER!");
        } 

        res.text().then(function(text){
            gameID = text;
        }).then( () => {

            //Check, if the code exists
            fetch('', {
                method: 'POST',
                body: JSON.stringify({
                    type: 'join-room',
                    room_id: gameID,
                    nick: document.getElementById('ngnick').value
                })
            }).then(function(res){
    
                if(res.status != 200){
                    document.getElementById('nerr').classList.remove('hidden');
                    document.getElementById('player_count').disabled = false;
                    document.getElementById('ngnick').disabled = false;
                    setTimeout(()=> {
                        document.getElementById('nerr').classList.add('hidden');
                    }, 5000);
                    return console.error("MALFORMED REQUEST RECIVED BY SERVER!");
                } 
    
            
                res.text().then(function(text){
                    if(text == "invalid") {
                        document.getElementById('nser').classList.add('hidden');
                        document.getElementById('nerr').classList.remove('hidden');
                            
                        setTimeout(()=> {
                            document.getElementById('nerr').classList.add('hidden');
                        }, 5000);
    
                        document.getElementById('player_count').disabled = false;
                        document.getElementById('ngnick').disabled = false;
                        return;
                    }
                    else {
                        document.getElementById('nser').classList.add('hidden');
                        document.getElementById('nsuc').classList.remove('hidden');
                        

                        window.localStorage.setItem('LOGTOKEN', text);
                        setTimeout(() => {
                            ClosePopup("Menu");
                            OpenPopup("Game");
                        }, 1000);
                    }
                });
            });
        });
    });
    //If yes, Negoshiate the socket connection

    //Start the game
}