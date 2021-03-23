$ = function(id) { return document.getElementById(id); }


function OnLoadEventHandler() {
    /*LOAD SETTINGS FROM LocalStorage*/
    GameSettings = JSON.parse(window.localStorage.getItem('GAMESETT'));
    if(GameSettings == null) {

        GameSettings = {};

        //Create Defaults
        GameSettings.Desynchronize        = true;
        GameSettings.LowQualTextures      = false;
        GameSettings.AutoReconect         = false;

        window.localStorage.setItem('GAMESETT', JSON.stringify(GameSettings));
    }


    /*CONTEXT CREATION*/
    CanvasElement = $('window');
    CanvasElement.width = window.innerWidth; 
    CanvasElement.height = window.innerHeight;

    ctx = CanvasElement.getContext("2d", {
        desynchronized: GameSettings.Desynchronize,
        preserveDrawingBuffer: GameSettings.Desynchronize
    });

    if (ctx === null) {

        alert("Web Browser Not Compatible With 2d Context!");
        window.location = "https://www.google.com/intl/en_us/chrome/";
    }


    /*SETUP TIMING*/
    TimePrev = performance.now();
    TimeNow = performance.now();

    /*CLEAR THE CANVAS*/
    ctx.clearRect(0, 0, CanvasElement.width, CanvasElement.height);


    /*CHECK FOR ?join_room QUERY*/
    if (location.search.startsWith("?")){
        const query = location.search.substring(1, location.search.length);
        const split = query.split("&");

        const queryObject = {};

        for (const parameter of split){
            const subsplit = parameter.split("=");
            const key = subsplit[0];
            const value = subsplit[1];
            queryObject[key] = value;
        }


        if (queryObject.hasOwnProperty("join_room")){
            //For safety also swich to JoinSubContainer
            OpenPopup("PlayContainer");
            OpenPopup("JoinGameSubcontainer"); 
            ClosePopup("CreateGameSubcontainer");
            
            $("JoinCode").value = queryObject.join_room;
            $("JoinCode").disabled = true;
        }
    }

    /*SET VALUES TO UI*/
    $("Desynchronize").checked = GameSettings.Desynchronize;
    $("LowQualTextures").checked = GameSettings.LowQualTextures;
    $("AutoReconect").checked = GameSettings.AutoReconect;

    if((GameSettings.AutoReconect && window.localStorage.getItem('OVERRIDE_REJOIN') != "stay") ||  window.localStorage.getItem('OVERRIDE_REJOIN') == "rejoin") {
        JWTAutoReconnect();
    }

    JWTPing().then((result) => {
        if (result) $("RejoinButton").disabled = false; 
    });
    window.localStorage.setItem('OVERRIDE_REJOIN', ""); //By this time you should have joined or stayed in Menu
}

function OnResizeEventHandler() {
    if((window.innerWidth < 500 || window.innerHeight < 420) && !ResAlertShown) {
        ResAlertShown = true;
        alert("It's quite likely that I'll break at this resolutions.");
    }
    
    if (CanvasElement != null) {
        CanvasElement.width = window.innerWidth; 
        CanvasElement.height = window.innerHeight;
        if (GameRunning) //To minimise repainting
            requestAnimationFrame(NextFrame);
    }
}

function OnMouseDownHandler(event) {

    if (GameRunning) {
        if(event.buttons == 4) MovingScreen = true;
        if(event.buttons == 1 && event.path[0].nodeName == "CANVAS") { 
            //Handle UI

            if(SelectedTile == null)
                SelectedTile = HighlightedTile;
            else 
                SelectedTile = null;
        }
    }

}

function OnMouseUpHandler(event) {
    if (GameRunning) {
        if(event.button == 1) MovingScreen = false; //Here 1 is middle button. Yes it's weird
    }
}

function OnMouseMoveEventHandler(event) {
    if (GameRunning) {
        if(MovingScreen) {
            XOffset += (event.clientX - MousePos.x) * MouseSpeedMultiplier;
            YOffset += (event.clientY - MousePos.y) * MouseSpeedMultiplier;
        }
        MousePos = {x: event.clientX, y: event.clientY};
    }
}

function OnMouseScrollEventHandler(event) {
    if (GameRunning) {
        if (event.deltaY > 0 && scaler > 2) scaler -= 0.1;
        if (event.deltaY < 0 && scaler < 6) scaler += 0.1;

    }
}
//Create Event Listeners
window.onload = OnLoadEventHandler;
window.onresize = OnResizeEventHandler;
window.onmousedown = OnMouseDownHandler;
window.onmouseup = OnMouseUpHandler;
window.onmousemove = OnMouseMoveEventHandler;
window.onwheel = OnMouseScrollEventHandler;

var MovingScreen = false;