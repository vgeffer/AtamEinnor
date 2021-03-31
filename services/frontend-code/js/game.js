function StartGame(code) {

    CreateWebSocket();

    LoadAssets();

    //Fix Glitch
    $('ChatWindow').addEventListener("wheel", (event) => { event.stopPropagation(); });  
    $('RoomCode').textContent = "Room Code: " + code;
    $('RoomLink').addEventListener("click", async function() {
        if (!navigator.clipboard)
            return;
        try {
            await navigator.clipboard.writeText(window.location.host + "/?join_room=" + code);
        } catch (error) {
            console.error("Copy failed", error);
        } 
    
    });
    GameRunning = true;
    requestAnimationFrame(NextFrame);
}

function LoadAssets() {

    CursorImg = new Image();
    CursorImg.src = "./assets/selector.png";
    
    DisabledCursorImg = new Image();
    DisabledCursorImg.src = "/assets/selector_disabled.png";

    tst_img[0] = new Image();
    tst_img[0].src = "/assets/dirt.png";

    tst_img[1] = new Image();
    tst_img[1].src = "/assets/stone.png";

    tst_img[2] = new Image();
    tst_img[2].src = "/assets/bedrock.png";

    tst_img[3] = new Image();
    tst_img[3].src = "/assets/dirt_dug.png";

    tst_img[4] = new Image();
    tst_img[4].src = "/assets/stone_dug.png";

    tst_img[5] = new Image();
    tst_img[5].src = "/assets/bedrock_dug.png";

    tst_img[6] = new Image();
    tst_img[6].src = "/assets/crystal_ore.png";

    tst_img[7] = new Image();
    tst_img[7].src = "/assets/diamond_ore.png";

    tst_img[8] = new Image();
    tst_img[8].src = "/assets/crystal_single.png";
    
    tst_img[9] = new Image();
    tst_img[9].src = "/assets/diamond_single.png";

    DwarfPl[0] = new Image();
    DwarfPl[0].src = "/assets/pl_dwarf_r.png";

    DwarfPl[1] = new Image();
    DwarfPl[1].src = "/assets/pl_dwarf_l.png";



    //Load Torch Animation (9 frames)
    for(let i = 0; i < 9; i++) {
        torch[i] = new Image();
        torch[i].src = "/assets/torch/torch" + i + ".png";
    }
    
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

    if((GnomeC + DwarfC) < 3) {
        $('ConfirmSelection').textContent = (GnomeC + DwarfC) + "/3"; 
        $('ConfirmSelection').disabled = true; 
    }
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

function EnterHandler(event) {

    event.stopPropagation();
    if(event.code == "Enter") {
        SendChatMessage();
    }

}


/*Store (calls from network)*/
function OpenStore(unitid) { 


    //Update ore quantities
    $('CrystalAll').textContent = "Sell All (" + Workers[unitid].inv.ores.crystal + ")";
    $('DiamondAll').textContent = "Sell All (" + Workers[unitid].inv.ores.diamond + ")";

    UpdatePricing();

    //Disable / enable buttons
    if(Workers[unitid].inv.ores.crystal == 0) {$('CrystalAll').disabled = true; $('CrystalOne').disabled = true;}
    else {$('CrystalAll').disabled = false; $('CrystalOne').disabled = false;}
    
    if(Workers[unitid].inv.ores.diamond == 0) {$('DiamondAll').disabled = true; $('DiamondOne').disabled = true;}
    else {$('DiamondAll').disabled = false; $('DiamondOne').disabled = false;}

    //Add DOM callbacks
    $('CrystalOne').addEventListener("click", () => { Sell(unitid, 'crystal', 1) });
    $('CrystalAll').addEventListener("click", () => { Sell(unitid, 'crystal', Workers[unitid].inv.ores.crystal) });

    
    $('DiamondOne').addEventListener("click", () => { Sell(unitid, 'diamond', 1) });
    $('DiamondAll').addEventListener("click", () => { Sell(unitid, 'diamond', Workers[unitid].inv.ores.diamond) });

    $('SupportOne').addEventListener("click", () => { Buy(unitid, 'supports') });
    $('LadderOne').addEventListener("click", () => { Buy(unitid, 'ladder') });
    $('TorchOne').addEventListener("click", () => { Buy(unitid, 'torch') });

    //Open The Popup
    OpenPopup('ShopContainer');
}

function UpdatePricing() {
        //Update Prices 
        $('SupportPrice').textContent = CurrentPrices.supports;
        $('LadderPrice').textContent = CurrentPrices.ladder;
        $('TorchPrice').textContent = CurrentPrices.torch;
    
        $('CrystalPrice').textContent = CurrentPrices.crystal;
        $('DiamondPrice').textContent = CurrentPrices.diamond;
    
        if(Money < CurrentPrices.supports) $('SupportOne').disabled = true; 
        else $('SupportOne').disabled = false; 
        
        if(Money < CurrentPrices.ladder) $('LadderOne').disabled = true; 
        else $('LadderOne').disabled = false;
    
        if(Money < CurrentPrices.torch) $('TorchOne').disabled = true; 
        else $('TorchOne').disabled = false;
}

function Buy(unit, thing) {
    socket.send(JSON.stringify({
        type: "player_action",
        content: {
            type: "buy-item",
            unitid: unit,
            item: thing
        }
    }));
}

function Sell(unit, ore, amount) {
    socket.send(JSON.stringify({
        type: "player_action",
        content: {
            type: "sell-item",
            unitid: unit,
            item: ore,
            quantity: amount
        }
    }));
}   


/*Network Handlers*/
function DisplayChatMessage(nick, message) {

    var MsgWrapper = document.createElement('div');

    var TextWrapper = document.createElement('div');
    var NickWrapper = document.createElement('div');

    MsgWrapper.classList.add('inline');
    if(!FirstMessage)MsgWrapper.classList.add('top-half-margin');

    NickWrapper.classList.add('bold-text');
    NickWrapper.classList.add('right-half-margin');
    NickWrapper.textContent = nick;

    TextWrapper.classList.add('break-word');
    TextWrapper.textContent = message;


    MsgWrapper.append(NickWrapper);
    MsgWrapper.append(TextWrapper);

    document.getElementById('Messages').appendChild(MsgWrapper);
    document.getElementById('Messages').scrollTo(0, document.getElementById('Messages').scrollHeight);


    FirstMessage = false;
}

function HandleError(err) {
    OpenPopup('DisconnectedMsgContainer');
    $('ErrorReason').textContent = err;
}

var DwarfC = 0, GnomeC = 0;