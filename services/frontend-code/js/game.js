function StartGame() {

    CreateWebSocket();
    World = new Map();

    GameRunning = true;
    requestAnimationFrame(NextFrame);
}

function SendChatMessage() {
    if(document.getElementById('Message').value != "") {
        socket.send(JSON.stringify({
            type: "send_message",
            content: document.getElementById("Message").value
        }));
        document.getElementById("Message").value = "";
    }
}

function EnterHandler() {

    if(window.event.key == "Enter") {
        SendChatMessage();
    }

}

function DisplayChatMessage(nick, message) {

    var MsgWrapper = document.createElement('div');
    var NickWrapper = document.createElement('div');

    MsgWrapper.classList.add('inline');
    if(!FirstMessage)MsgWrapper.classList.add('top-half-margin');

    NickWrapper.classList.add('bold-text');
    NickWrapper.classList.add('right-half-margin');
    NickWrapper.textContent = nick;

    MsgWrapper.textContent = message;
    MsgWrapper.prepend(NickWrapper);

    document.getElementById('Messages').appendChild(MsgWrapper);
    document.getElementById('Messages').scrollTo(0, document.getElementById('Messages').scrollHeight);


    FirstMessage = false;
}


//