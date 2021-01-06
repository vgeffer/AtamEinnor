#include "Graphics.hpp"



void DrawTransformed(Sprite* spr, uint32_t* surface){

    for(int x = 0; x < spr->W; x++){
        for(int y = 0; y < spr->H; y++){

                Vec2 pixelPos = {0 , 0};
                Vec2 transformVector = {
                        x + spr->position.x - spr->trasformOrigin.x,
                        y + spr->position.y - spr->trasformOrigin.y
                    };


                Mat2DMultiplyVector(&(spr->transformMatrix), &transformVector, &pixelPos);
                Vec2Add(&pixelPos, &(spr->trasformOrigin), &pixelPos);

                switch(spr->sampling){
                    case SamplingType::NEAREST_NEIGHBOR:
                        //Get XY pos on surface

                        uint32_t a = spr->data[((int)(pixelPos.y)) * spr->W + ((int)(pixelPos.x))];
                    break;
                }    

        }
    }



}


void DrawRaw(Sprite* spr, uint32_t* surface){

     for(int x = 0; x < spr->W; x++){
        for(int y = 0; y < spr->H; y++){

            //Get XY pos on surface

            uint32_t a = spr->data[y * spr->W + x];


        }
    }


}

