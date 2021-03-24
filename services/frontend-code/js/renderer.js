

function NextFrame() {

    TimeNow = performance.now();
    TimeElapsed = TimeNow - TimePrev;
    TimePrev = TimeNow;


    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    //Todo: Replace with size recived with world
    var x_limit = 64;
    var y_limit = 64; 
    
    var x_coord_shift = (tst_img[0].width + 64) * scaler;
    var y_coord_shift = (tst_img[0].height / 2) * scaler;

    //Yes this temporary piece of shit is what's going to be here
    for(var y = 0; y < y_limit; y++) {
        for(var x = 0; x < x_limit; x++) {
            ctx.drawImage(tst_img[0], (y % 2 == 0 ? x * x_coord_shift : x * x_coord_shift + 128 * scaler) + XOffset, y * y_coord_shift + YOffset, tst_img[0].width * scaler, tst_img[0].height * scaler);   
            


            //Check for cursor and draw it
            if(MousePos.x > (y % 2 == 0 ? x * x_coord_shift : x * x_coord_shift + 128 * scaler) + XOffset
               && MousePos.x < (y % 2 == 0 ? (x + 1) * x_coord_shift : (x + 1) * x_coord_shift + 128 * scaler) + XOffset
               && MousePos.y > y * y_coord_shift + YOffset
               && MousePos.y < (y + 1) * y_coord_shift + YOffset 
               && SelectedTile == null) { //Also check if any tile is selected
                    ctx.drawImage(CursorImg, (y % 2 == 0 ? x * x_coord_shift : x * x_coord_shift + 128 * scaler) + XOffset, y * y_coord_shift + YOffset, 192 * scaler, 128 * scaler);
                    HighlightedTile = {x: x, y: y};
            }

            if(SelectedTile != null) {
                if(SelectedTile.x == x 
                   && SelectedTile.y == y)
                    ctx.drawImage(CursorImg, (y % 2 == 0 ? x * x_coord_shift : x * x_coord_shift + 128 * scaler) + XOffset, y * y_coord_shift + YOffset, 192 * scaler, 128 * scaler);
            }
        } 
    }

    //debugger; //To stop at least some cheating


    requestAnimationFrame(NextFrame);
}

var drawn = false;