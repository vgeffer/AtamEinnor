#include "Graphics.hpp"



void DrawTransformed(Sprite* spr, FrameBuffer* fb){

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
                    int spriteX = (int)spr->position.x, spriteY = (int)spr->position.y;
                    if(spriteX + x >= fb->W || spriteY + y >= fb->H) break; //Clip sprite against edges of screen
                    fb->data[(spriteY + y) * fb->W + (spriteX + x)] = spr->data[((int)(pixelPos.y)) * spr->W + ((int)(pixelPos.x))];
                    break;
            }    

        }
    }



}

void DrawRaw(Sprite* spr, FrameBuffer* fb){

     for(int x = 0; x < spr->W; x++){
        for(int y = 0; y < spr->H; y++){

            switch(spr->sampling){
                case SamplingType::NEAREST_NEIGHBOR:
                    int spriteX = (int)spr->position.x, spriteY = (int)spr->position.y;
                    if(spriteX + x >= fb->W || spriteY + y >= fb->H) break; //Clip sprite against edges of screen
                    fb->data[(spriteY + y) * fb->W + (spriteX + x)] = spr->data[y * spr->W + x];
                break;
            }    
        }
    }


}

int CreateSpriteSprite(const char* path, Sprite* spr){


    spr = (Sprite*)malloc(sizeof(Sprite));

    std::ifstream img = std::ifstream(path, std::ifstream::binary);

    //If file not found, throw an error
    if(!img.is_open())return ErrCode::FILE_NOT_FOUND;
    
    //Img Data
    char Header[16], *RawData;

    //Indicies into img's decompresed data
    int imgInd = 0; 

    //Only 9 bytes for header, rest for further expansion
    int imgW, imgH;
    char Compressed;

    //Read the header info
    img.read(Header, 16);
    imgW = Header[0] << 24 | Header[1] << 16 | Header[2] << 8 | Header[3];
    imgH = Header[4] << 24 | Header[5] << 16 | Header[6] << 8 | Header[7];
    Compressed = Header[8];
    
    spr->W = imgW;
    spr->H = imgH;

    img.seekg (0, img.end);
    int length = img.tellg(); //Get Length of the file
    img.seekg (16, img.beg); //Skip the header portion

    length -= 16; //Remove the header portion from length of the file

    //Alloc mem for file and img
    RawData = (char*)malloc(length);
    spr->data = (uint32_t*)malloc(imgW * imgH * sizeof(uint32_t));

    img.read(RawData, length);


    if(Compressed) {
        
        for(int i = 0; i < length; i++) {

            //If MSB Set, Treat this as color
            uint32_t ByteSeqLen = RawData[i++] << 24 | RawData[i++] << 16 | RawData[i++] << 8 | RawData[i++]; //Prepare for the next reading
            if(ByteSeqLen & 0x80000000){
                uint32_t alpha = ((ByteSeqLen & 0x7FFFFFFF) << 1) & 0xFF000000; //Alpha hack
                spr->data[imgInd++] = alpha | ByteSeqLen & 0x00FFFFFF;
                continue;
            }

            uint32_t col = RawData[i++] << 24 | RawData[i++] << 16 | RawData[i++] << 8 | RawData[i++]; 
            for(int j = 0; j < ByteSeqLen; j++){
                spr->data[imgInd++] = col;
            }
        }

        free(RawData);
        return ErrCode::OK;
    }

    for(int i = 0; i < length; i++) {

        uint32_t col = RawData[i++] << 24 | RawData[i++] << 16 | RawData[i++] << 8 | RawData[i++]; 
        spr->data[imgInd++] = col;
    }
    
    free(RawData);
    return ErrCode::OK;
}

void DestroySprite(Sprite* spr) {
    free(spr->data);
    free(spr);
}