function NextFrame(once) {
    TimeNow = performance.now();
    TimeElapsed = TimeNow - TimePrev;
    TimePrev = TimeNow;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    //Todo: Replace with size recived with world
    var x_limit = World.size_x;
    var y_limit = World.size_y; 
    
    var x_coord_shift = (tst_img[0].width + 64) * scaler;
    var y_coord_shift = (tst_img[0].height / 2) * scaler;


    //Yes this temporary piece of shit is what's going to be here
    for(var y = 0; y < y_limit; y++) {
        for(var x = 0; x < x_limit; x++) {

            //Draw Single center ore
            if(World.ores[y* x_limit + x].ore){
                if(World.ores[y* x_limit + x].walls[6] == 1) 
                    ctx.drawImage(tst_img[World.ores[y * x_limit + x].sprite + 2], 
                                 (y % 2 == 0 ? x * x_coord_shift : x * x_coord_shift + 128 * scaler) + XOffset, 
                                  y * y_coord_shift + YOffset, 
                                  192 * scaler, 
                                  128 * scaler);
            }

            //Draw covers & ores in 6 pieces
            for(var t = 0; t < 6; t++) {

                //Draw Ores
                if(World.ores[y* x_limit + x].ore){
                    var ore_img = null;
                    if(World.ores[y* x_limit + x].walls[t] == 1) {
                        ore_img = tst_img[World.ores[y * x_limit + x].sprite];
                        ctx.drawImage(ore_img, TileOffsets[t].sx, TileOffsets[t].sy, 64, 64, (y % 2 == 0 ? x * x_coord_shift : x * x_coord_shift + 128 * scaler) + XOffset + TileOffsets[t].sx * scaler, y * y_coord_shift + YOffset + TileOffsets[t].sy * scaler, 64 * scaler, 64 * scaler);
                    }
                }
            }
               
            //Draw Covers
            var cover_img = null;
            if(World.covers[y* x_limit + x].hardness != 0) cover_img = tst_img[World.covers[y * x_limit + x].sprite];
            else cover_img = tst_img[World.covers[y * x_limit + x].sprite + 3];
                
            ctx.drawImage(cover_img, (y % 2 == 0 ? x * x_coord_shift : x * x_coord_shift + 128 * scaler) + XOffset, y * y_coord_shift + YOffset, 192 * scaler, 128 * scaler);   
        } 
    }

    if (CursorDrawn) {
        //Check for cursor and draw it
        const mouseX = MousePos.x - XOffset;
        const mouseY = MousePos.y - YOffset;

        const tileHeight = 128 * scaler;
        const tileWidth = 192 * scaler;

        let y = mouseY / (tileHeight * 0.5);
        let yFraction = y - Math.floor(y);
        y = Math.floor(y);

        let xFraction = mouseX / (tileWidth * 4 / 3);
        xFraction = xFraction - Math.floor(xFraction);
        let x = Math.floor(xFraction * 4);
        xFraction = xFraction * 4 - x;

        if (y % 2 === 0){
            switch (x){
                case 0:
                    if (yFraction < (1 - xFraction)){
                        y -= 1;
                    }
                    break;
                case 1:

                    break;
                case 2:
                    if (yFraction < xFraction){
                        y -= 1;
                    }
                    break;
                case 3:
                    y -= 1;
                    break;
            }
        } else {
            switch (x){
                case 0:
                    if (yFraction < xFraction){
                        y -= 1;
                    }
                    break;
                case 1:
                    y -= 1;
                    break;
                case 2:
                    if (yFraction < (1 - xFraction)){
                        y -= 1;
                    }
                    break;
                case 3:
                    
                    break;
            }
        }
        
        if (y % 2 === 0){
            x = Math.floor(mouseX / (tileWidth * 4 / 3));
        } else {
            x = Math.floor((mouseX - tileWidth * 2 / 3) / (tileWidth * 4 / 3));
        }

        if(x >= 0 && y >= 0) {
            ctx.drawImage(CursorImg, (y % 2 == 0 ? x * x_coord_shift : x * x_coord_shift + 128 * scaler) + XOffset, y * y_coord_shift + YOffset, 192 * scaler, 128 * scaler);
            HighlightedTile = {x: x, y: y};
        }
        

        if(SelectedTile != null) {
            if(SelectedTile.x == x 
              && SelectedTile.y == y)
                ctx.drawImage(CursorImg, (y % 2 == 0 ? x * x_coord_shift : x * x_coord_shift + 128 * scaler) + XOffset, y * y_coord_shift + YOffset, 192 * scaler, 128 * scaler);
        }
    }

    //debugger; //To stop at least some cheating

    if (once !== true){
        requestAnimationFrame(NextFrame);
    }
}

//Constant Tile Offsets
const TileOffsets = [

    //Top Row
    {sx: 0, sy: 0},
    {sx: 64, sy: 0},
    {sx: 128, sy: 0},

    //Bottom Row
    {sx: 0, sy: 64},
    {sx: 64, sy: 64},
    {sx: 128, sy: 64}
];