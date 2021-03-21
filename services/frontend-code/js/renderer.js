

function NextFrame() {

    TimeNow = performance.now();
    TimeElapsed = TimeNow - TimePrev;
    TimePrev = TimeNow;


    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    var x_limit = Math.ceil(window.innerWidth / ((tst_img[0].width + 16) * scaler)) + 1;
    var y_limit = Math.ceil(window.innerHeight / ((tst_img[0].height / 2) * scaler)) + 1; //for safety
    
    var x_coord_shift = (tst_img[0].width + 16) * scaler;
    var y_coord_shift = (tst_img[0].height / 2) * scaler;

    //Yes this temporary piecoe of shit is what's going to be here
    for(var y = 0; y < y_limit; y++) {
        for(var x = 0; x < x_limit; x++) {
            ctx.drawImage(tst_img[0], (y % 2 == 0 ? x * x_coord_shift : x * x_coord_shift + 32 * scaler) + XOffset, y * y_coord_shift + YOffset, 48 * scaler, 32 * scaler);    
        } 
    }
    requestAnimationFrame(NextFrame);
}

function LoadAssets() {
   
}

var drawn = false;