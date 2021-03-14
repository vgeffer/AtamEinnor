


function OnLoadEventHandler() {

    

    /*LOAD SETTINGS FROM LocalStorage*/
    RenderSettings = JSON.parse(window.localStorage.getItem('RENDSETT'));
    if(RenderSettings == null) {

        RenderSettings = {};

        //Create Defaults
        RenderSettings.Desynchronize        = true;
        RenderSettings.Alpha                = false;
        RenderSettings.TextureQuality       = LOD_MED;

        window.localStorage.setItem('RENDSETT', JSON.stringify(RenderSettings));
    }


    /*CONTEXT CREATION*/
    CanvasElement = document.getElementById('window');
    CanvasElement.style = "width: " + window.innerWidth + "px; height: " + window.innerHeight + "px;";

    ctx = CanvasElement.getContext("2d", {
        desynchronized: RenderSettings.Desynchronize,
        preserveDrawingBuffer: RenderSettings.Desynchronize
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
            OpenPopup("JoinGamePopup");

            document.getElementById("join_code").value = queryObject.join_room;
            document.getElementById("join_code").disabled = true;
        }
    }
}

function OnResizeEventHandler() {
    if((window.innerWidth < 500 || window.innerHeight < 380) && !ResAlertShown) {
        ResAlertShown = true;
        alert("It's quite likely that I'll break at this resolutions.");
    }
    
    if (CanvasElement != null) {
        CanvasElement.style = "width: " + window.innerWidth + "px; height: " + window.innerHeight + "px;";
    }
}

function OnKeyPressHandler(event) {

}

function OnKeyDownEventHandler(event) {

}

function OnMouseDownHandler(event) {

}

function OnMouseMoveEventHandler(event) {

}

function OnMouseWheelHandler(event) {

}

//Create Event Listeners
window.onload = OnLoadEventHandler;
window.onresize = OnResizeEventHandler;
window.onkeypress = OnKeyPressHandler;
window.onkeydown = OnKeyDownEventHandler;
window.onmousedown = OnMouseDownHandler;
window.onmousemove = OnMouseMoveEventHandler;
window.onmousewheel = OnMouseWheelHandler;


//Page Stuff

