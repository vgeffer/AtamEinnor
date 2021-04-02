function NextFrame(once) {
    TimeNow = performance.now();
    TimeElapsed = TimeNow - TimePrev;
    TimePrev = TimeNow;

    FrameCounter++;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

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
               
            //Draw Items
            if(World.covers[y* x_limit + x].item == "torch") {
                ctx.drawImage(torch[Math.floor(FrameCounter / 4) % 9], (y % 2 == 0 ? x * x_coord_shift + 76 * scaler : x * x_coord_shift + 204 * scaler) + XOffset, y * y_coord_shift + 32 * scaler + YOffset, 32 * scaler, 64 * scaler);
            }

            if(World.covers[y* x_limit + x].item == "support") {
                ctx.drawImage(support, (y % 2 == 0 ? x * x_coord_shift : x * x_coord_shift + 128 * scaler) + XOffset, y * y_coord_shift + YOffset, 192 * scaler, 128 * scaler);
            }

            if(World.covers[y* x_limit + x].item == "ladder") {
                ctx.drawImage(ladder, (y % 2 == 0 ? x * x_coord_shift : x * x_coord_shift + 128 * scaler) + XOffset, y * y_coord_shift + YOffset, 192 * scaler, 128 * scaler);
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

        const tile = screenCoordsToGrid(tileWidth, tileHeight, mouseX, mouseY);

        let x = tile.x;
        let y = tile.y;

        if(SelectedUnit != -1 && SelectedUnit < 3) {
            if(x != HighlightedTile.x || y != HighlightedTile.y) {
                if(x >= 0 && y >= 0) {
                
                    var path = pathfind(World.covers, 48, 32, x, y, Workers[SelectedUnit].x, Workers[SelectedUnit].y);
                    console.log(path);
                    
                    if(path == null) ctx.drawImage(DisabledCursorImg, (y % 2 == 0 ? x * x_coord_shift : x * x_coord_shift + 128 * scaler) + XOffset, y * y_coord_shift + YOffset, 192 * scaler, 128 * scaler);
                    else {
                        ctx.drawImage(CursorImg, (y % 2 == 0 ? x * x_coord_shift : x * x_coord_shift + 128 * scaler) + XOffset, y * y_coord_shift + YOffset, 192 * scaler, 128 * scaler);
                        HighlightedTile = {x: x, y: y};
                    }
                }
            }
        }

        if(SelectedTile != null) {
            if(SelectedTile.x == x 
              && SelectedTile.y == y)
                ctx.drawImage(CursorImg, (y % 2 == 0 ? x * x_coord_shift : x * x_coord_shift + 128 * scaler) + XOffset, y * y_coord_shift + YOffset, 192 * scaler, 128 * scaler);
        }

    }

    //Draw characters & do path update for the next frame
    for(let i = 0; i < Workers.length; i++) {
        if(Workers[i].type == "dwarf") {
            ctx.drawImage(DwarfPl[Workers[i].dir], Workers[i].x * scaler + XOffset, Workers[i].y * scaler + YOffset, 64 * scaler, 64 * scaler);    
        }

        if(Workers[i].type == "gnome") {
            ctx.drawImage(GnomePL[Workers[i].dir], Workers[i].x * scaler + XOffset, Workers[i].y * scaler + YOffset, 64 * scaler, 64 * scaler);    
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

function screenCoordsToGrid(tileWidth, tileHeight, regularX, regularY){
    let y = regularY / (tileHeight * 0.5);
    let yFraction = y - Math.floor(y);
    y = Math.floor(y);

    let xFraction = regularX / (tileWidth * 4 / 3);
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
    
/*     let third = x;
    if (y % 2 === 1){
        third += 2;
        third %= 4;
    } */

    if (y % 2 === 0){
        x = Math.floor(regularX / (tileWidth * 4 / 3));
    } else {
        x = Math.floor((regularX - tileWidth * 2 / 3) / (tileWidth * 4 / 3));
    }

    return {
        x: x,
        y: y
    };
}