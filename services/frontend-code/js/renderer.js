

function NextFrame() {

    TimeNow = performance.now();
    TimeElapsed = TimeNow - TimePrev;
    TimePrev = TimeNow;


    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    //Todo: Replace with size recived with world
    var x_limit = 64;
    var y_limit = 64; 
    
    var x_coord_shift = (tst_img[0].width + 16) * scaler;
    var y_coord_shift = (tst_img[0].height / 2) * scaler;

    //Yes this temporary piecoe of shit is what's going to be here
    for(var y = 0; y < y_limit; y++) {
        for(var x = 0; x < x_limit; x++) {
            ctx.drawImage(tst_img[0], (y % 2 == 0 ? x * x_coord_shift : x * x_coord_shift + 32 * scaler) + XOffset, y * y_coord_shift + YOffset, 48 * scaler, 32 * scaler);   
            


            //Check for cursor and draw it
            if(MousePos.x > (y % 2 == 0 ? x * x_coord_shift : x * x_coord_shift + 32 * scaler) + XOffset
               && MousePos.x < (y % 2 == 0 ? (x + 1) * x_coord_shift : (x + 1) * x_coord_shift + 32 * scaler) + XOffset
               && MousePos.y > y * y_coord_shift + YOffset
               && MousePos.y < (y + 1) * y_coord_shift + YOffset 
               && SelectedTile == null) { //Also check if any tile is selected
                    ctx.drawImage(CursorImg, (y % 2 == 0 ? x * x_coord_shift : x * x_coord_shift + 32 * scaler) + XOffset, y * y_coord_shift + YOffset, 48 * scaler, 32 * scaler);
                    HighlightedTile = {x: x, y: y};
            }

            if(SelectedTile != null) {
                if(SelectedTile.x == x 
                   && SelectedTile.y == y)
                    ctx.drawImage(CursorImg, (SelectedTile.y % 2 == 0 ? SelectedTile.x * x_coord_shift : SelectedTile.x * x_coord_shift + 32 * scaler) + XOffset, SelectedTile.y * y_coord_shift + YOffset, 48 * scaler, 32 * scaler);
            }
        } 
    }

    //debugger; //To stop at least some cheating


    requestAnimationFrame(NextFrame);
}

var drawn = false;