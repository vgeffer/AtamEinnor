
function OpenPopup(popupid) {
    document.getElementById(popupid).classList.remove('hidden');
}

function ClosePopup(popupid) {
    document.getElementById(popupid).classList.add('hidden');
}

function JoinGame() {

    //Hide all messages
    document.getElementById('err').classList.add('hidden');
    document.getElementById('ser').classList.add('hidden');
    document.getElementById('suc').classList.add('hidden');


    var gameID = document.getElementById('join_code').value;

    //Check if ID is valid
    if(gameID.length != 8) {
        document.getElementById('err').classList.remove('hidden');
        setTimeout(()=> {
            document.getElementById('err').classList.add('hidden');
        }, 5000);
        return;
    }

    //Show 'SEARCHING...' text
    document.getElementById('ser').classList.remove('hidden');

    //Check, if the code exists



    //If yes, Negoshiate the socket connection

    //Start the game

}
