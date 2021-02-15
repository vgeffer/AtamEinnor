#define _CRT_SECURE_NO_WARNINGS //So compiler would shut up!


#include <chrono>
#include <ctime>
#include <map>
#include <math.h>

#include "game/Renderer.hpp"
#include "Platform.hpp"
#include "Common.hpp"


void circle(Vec2 pos, float radius, uint32_t color, FrameBuffer* buffer) {
    int intRadius = (int)radius;

    unsigned int* topBuffer = buffer->data;
    unsigned int* bottomBuffer = buffer->data + 2 * intRadius * buffer->W;

    for (float row = 0; row < radius + 1; row++) {
        float cosinef = sqrtf((radius * radius) - (radius - row) * (radius - row));
        int cosine = (int)ceilf(cosinef);

        for (int i = intRadius - cosine; i <= intRadius + cosine; i++) {
            topBuffer[i + (int)(pos.y * buffer->W + pos.x)] = color - i * 2;
            bottomBuffer[i + (int)(pos.y * buffer->W + pos.x)] = color + i * 2;
        }

        topBuffer += buffer->W;
        bottomBuffer -= buffer->W;
    }
}

int main(int argc, char *argv[]) {



    Window win;
    VideoMode mode;
    FrameBuffer fbuf; //IMPORTANT!!1!!1: Colors are ARGB!!!1!
    Keyboard keyboard;
    SDL_Event e;

    std::map<uint32_t, bool> keymap; //Keyboard map

    camera_t cam;

    auto prev = std::chrono::system_clock::now();
    auto now = std::chrono::system_clock::now();

    mode = {800, 800, false, false};

    if(CreateWindow(mode, &win) > OK) return -1;
    if(CreateFrameBuffer(mode, &fbuf) > OK) return -1;

    //Seed RNG
    std::time_t t = std::time(0);   // get time now
    std::tm* tm_now = std::localtime(&t);
    srand((tm_now->tm_year - tm_now->tm_yday) * tm_now->tm_sec + (tm_now->tm_wday * tm_now->tm_min) - tm_now->tm_sec * tm_now->tm_mday);

    //===========================
    // Create game-related stuff
    //===========================

    CreateCam(&cam); 
    AssignTarget(&cam, &fbuf);

    LoadKeybinds(&keyboard);

    //Main Game Loop
    while(1) {

        //Do the timing
        now = std::chrono::system_clock::now();
        float elapsed = ((std::chrono::duration<float>)(now-prev)).count();
        now = prev;

        //Handle the controls

        while(SDL_PollEvent(&e) == 1){

            switch (e.type) {

                case SDL_KEYDOWN:
                    keymap[e.key.keysym.sym] = true;

                    if (e.key.keysym.sym == keyboard.GetKey("DBG_EX"))
                        goto quit;

                    break;

                
                case SDL_KEYUP:
                    keymap[e.key.keysym.sym] = false;
                    break;


                case SDL_MOUSEBUTTONDOWN:
                    break;

                case SDL_QUIT:
                    goto quit;
            }
        }


        //for held keys
        for (auto const& element : keymap) {

            if (element.first == keyboard.GetKey("CAM_U") && element.second) cam.c_pos.y += CAM_FIXED_PAN_SPEED * elapsed;
            if (element.first == keyboard.GetKey("CAM_D") && element.second) cam.c_pos.y -= CAM_FIXED_PAN_SPEED * elapsed;
            if (element.first == keyboard.GetKey("CAM_L") && element.second) cam.c_pos.x += CAM_FIXED_PAN_SPEED * elapsed;
            if (element.first == keyboard.GetKey("CAM_R") && element.second) cam.c_pos.x -= CAM_FIXED_PAN_SPEED * elapsed;
        }

        circle({ 10, 10 }, 300, 0xFFFF0000, &fbuf);

        //RenderImage(nullptr); //Render main camera
        PushFrame(&fbuf, &win);
    }

    //Needed for some things
    quit:

    //Cleanup
    
    TTF_CloseFont(font);
    
    DestroyFrameBuffer(&fbuf);    
    DestroyWindow(&win);

    return 0;
}




