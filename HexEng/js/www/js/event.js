


function OnLoadEventHandler() {

    /*LOAD SETTINGS FROM LocalStorage*/
    RenderSettings = window.localStorage.getItem('RENDSETT');
    if(RenderSettings === null) {

        RenderSettings = {};

        //Create Defaults
        RenderSettings.Desynchronize        = true;
        RenderSettings.Alpha                = false;
        RenderSettings.TextureQuality       = LOD_MED;

        window.localStorage.setItem('RENDSETT', RenderSettings);
    }


    /*GL CONTEXT CREATION*/
    CanvasElement = document.getElementById('window');
    CanvasElement.style = "width: " + window.innerWidth + "px; height: " + window.innerHeight + "px;";

    ctx = CanvasElement.getContext("2d", {
        desynchronized: RenderSettings.Desynchronize,
        preserveDrawingBuffer: RenderSettings.Desynchronize
    });

    if(ctx === null) {

        alert("Web Browser Not Compatible With 2d Context!");
        window.location = "https://www.google.com/intl/en_us/chrome/";
    }


    /*SETUP TIMING*/
    TimePrev = performance.now();
    TimeNow = performance.now();

    /*START GAME*/
    requestAnimationFrame(NextFrame);
}

function OnResizeEventHandler() {
    CanvasElement.style = "width: " + window.innerWidth + "px; height: " + window.innerHeight + "px;";
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


function OnMenuButtonClick(event) {

    switch(event) {
        case 'newgame':
        break;
    }

}

//Create Event Listeners
window.onload = OnLoadEventHandler;
window.onresize = OnResizeEventHandler;
window.onkeypress = OnKeyPressHandler;
window.onkeydown = OnKeyDownEventHandler;
window.onmousedown = OnMouseDownHandler;
window.onmousemove = OnMouseMoveEventHandler;
window.onmousewheel = OnMouseWheelHandler;
