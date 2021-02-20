

function NextFrame() {

    TimeNow = performance.now();
    TimeElapsed = TimeNow - TimePrev;
    TimePrev = TimeNow;


    ctx.drawImage(TileSet, 200, 300);


    requestAnimationFrame(NextFrame);
}

function LoadAssets() {
    TileSet = new Image();
    TileSet.src = "res/page/upjs_opaque.png";
}