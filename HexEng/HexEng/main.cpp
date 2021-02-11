#define _CRT_SECURE_NO_WARNINGS //So compiler would shut up!


#include <chrono>
#include <ctime>
#include <map>

#include "game/Game.hpp"
#include "Platform.hpp"
#include "Common.hpp"


int main(int argc, char *argv[]) {



    Window win;
    VideoMode mode;
    FrameBuffer fbuf; //IMPORTANT!!1!!1: Colors are ARGB!!!1!
    Keyboard keyboard;
    SDL_Event e;

    std::map<uint32_t, bool> keymap; //Keyboard map

    auto prev = std::chrono::system_clock::now();
    auto now = std::chrono::system_clock::now();


    mode = {800, 600, false, false};

    if(CreateWindow(mode, &win) > OK) return -1;
    if(CreateFrameBuffer(mode, &fbuf) > OK) return -1;

    //Seed RNG
    std::time_t t = std::time(0);   // get time now
    std::tm* tm_now = std::localtime(&t);
    srand((tm_now->tm_year - tm_now->tm_yday) * tm_now->tm_sec + (tm_now->tm_wday * tm_now->tm_min) - tm_now->tm_sec * tm_now->tm_mday);

    //===========================
    // Create game-related stuff
    //===========================
    
    CreateCam(&c_plrcam); 
    AssignTarget(&c_plrcam, &fbuf);

    LoadKeybinds(&keyboard);

  

    uint32_t debug_col = 0xFF000000;

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

            if (element.first == keyboard.GetKey("CAM_U") && element.second) c_plrcam.c_pos.y += CAM_FIXED_PAN_SPEED * elapsed;
            if (element.first == keyboard.GetKey("CAM_D") && element.second) c_plrcam.c_pos.y -= CAM_FIXED_PAN_SPEED * elapsed;
            if (element.first == keyboard.GetKey("CAM_L") && element.second) c_plrcam.c_pos.x += CAM_FIXED_PAN_SPEED * elapsed;
            if (element.first == keyboard.GetKey("CAM_R") && element.second) c_plrcam.c_pos.x -= CAM_FIXED_PAN_SPEED * elapsed;
        }



        //RenderImage(nullptr); //Render main camera
        PushFrame(&fbuf, &win);
    }

    //Needed for some things
    quit:

    //Cleanup
    DestroyFrameBuffer(&fbuf);
    DestroyWindow(&win);

    return 0;
}




