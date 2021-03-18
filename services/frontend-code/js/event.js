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
    CanvasElement.style = "width: " + window.innerWidth + "px; height: " + window.innerHeight + "px;";

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

    if(GameSettings.AutoReconect ||  window.localStorage.getItem('OVERRIDE_REJOIN')) {
        JoinGameJWT();
    }

    JWTPing().then((result) => {
        if (result) $("RejoinButton").disabled = false; 
    });
}

function OnResizeEventHandler() {
    if((window.innerWidth < 500 || window.innerHeight < 420) && !ResAlertShown) {
        ResAlertShown = true;
        alert("It's quite likely that I'll break at this resolutions.");
    }
    
    if (CanvasElement != null) {
        CanvasElement.style = "width: " + window.innerWidth + "px; height: " + window.innerHeight + "px;";
    }
}

function OnMouseDownHandler(event) {


}

function OnMouseMoveEventHandler(event) {

}

//Create Event Listeners
window.onload = OnLoadEventHandler;
window.onresize = OnResizeEventHandler;
window.onmousedown = OnMouseDownHandler;
window.onmousemove = OnMouseMoveEventHandler;