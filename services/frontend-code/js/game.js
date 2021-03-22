function StartGame() {

    CreateWebSocket();
    World = new Map();

    LoadAssets();

    GameRunning = true;
    requestAnimationFrame(NextFrame);
}

function LoadAssets() {

    CursorImg = new Image();
    CursorImg.src = "./assets/selector.png"
    
    tst_img[0] = new Image();
    tst_img[0].src = "/assets/unknown.png";

    tst_img[1] = new Image();
    tst_img[1].src = "/assets/unknown2.png";

    tst_img[2] = new Image();
    tst_img[2].src = "/assets/unknown4.png";

    tst_img[3] = new Image();
    tst_img[3].src = "/assets/unknown6.png";


}

function ExitGame() {
    window.localStorage.setItem('OVERRIDE_REJOIN', "stay");
    window.location = window.location;
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