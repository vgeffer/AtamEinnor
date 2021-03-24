function StartGame(code) {

    CreateWebSocket();
    World = new Map();

    LoadAssets();

    //Fix Glitch
    $('ChatWindow').addEventListener("wheel", (event) => { event.stopPropagation(); });  
    $('RoomCode').textContent = "Room Code: " + code;
    $('RoomLink').addEventListener("click", async function() {
        if (!navigator.clipboard)
            return;
        try {
            await navigator.clipboard.writeText(window.location.host + "?join_room=" + code);
        } catch (error) {
            console.error("Copy failed", error);
        } 
    
    });
    GameRunning = true;
    requestAnimationFrame(NextFrame);
}

function LoadAssets() {

    CursorImg = new Image();
    CursorImg.src = "./assets/selector.png"
    
    tst_img[0] = new Image();
    tst_img[0].src = "/assets/tst.png";

    tst_img[1] = new Image();
    tst_img[1].src = "/assets/unknown2.png";

    tst_img[2] = new Image();
    tst_img[2].src = "/assets/unknown4.png";

    tst_img[3] = new Image();
    tst_img[3].src = "/assets/unknown6.png";


}

/*DOM Callbacks*/
function AddWorker(worker) {
    if(worker == "dwarf" && DwarfC < 3 && (DwarfC + GnomeC) < 3) {
        DwarfC++;   
    }
    else if(worker == "gnome" && GnomeC < 3 && (DwarfC + GnomeC) < 3) {
        GnomeC++;
    }

    $('DwarfCount').textContent = DwarfC;
    $('GnomeCount').textContent = GnomeC;
    $('ConfirmSelection').textContent = (GnomeC + DwarfC) + "/3" 

    if((GnomeC + DwarfC) == 3) {
        $('ConfirmSelection').textContent = "Confirm";
        $('ConfirmSelection').disabled = false; 
    }
}

function SubWorker(worker) {
    if(worker == "dwarf" && DwarfC > 0 && (DwarfC + GnomeC) > 0) {
        DwarfC--;   
    }
    else if(worker == "gnome" && GnomeC > 0 && (DwarfC + GnomeC) > 0) {
        GnomeC--;
    }

    $('DwarfCount').textContent = DwarfC;
    $('GnomeCount').textContent = GnomeC;
    $('ConfirmSelection').textContent = (GnomeC + DwarfC) + "/3"; 
    $('ConfirmSelection').disabled = true; 
}

function SaveWorkers() {
    socket.send(JSON.stringify({
        type: "save_workers",
        gcount: GnomeC,
        dcount: DwarfC
    }));
    ClosePopup('CharSelectContainer');
}

function ExitGame() {
    window.localStorage.setItem('OVERRIDE_REJOIN', "stay");
    window.location = window.location;
}

function AllowStart() {
    socket.send(JSON.stringify({
        type: "host_start_game",
        content: window.localStorage.getItem('LOGTOKEN')
    }));
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

/*Network Handlers*/
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

function HandleError(err) {
    
}

var DwarfC = 0, GnomeC = 0;