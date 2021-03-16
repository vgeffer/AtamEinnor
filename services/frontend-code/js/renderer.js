

function NextFrame() {

    TimeNow = performance.now();
    TimeElapsed = TimeNow - TimePrev;
    TimePrev = TimeNow;


   

    requestAnimationFrame(NextFrame);
}

function LoadAssets() {
   
}

