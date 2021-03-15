function StartGame() {

    CreateWebSocket();
    

    GameRunning = true;
    requestAnimationFrame(NextFrame);
}

function SendChatMessage() {
    socket.send(JSON.stringify({
        type: "send_message",
        content: document.getElementById("Message").value
    }));
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

    FirstMessage = false;
}