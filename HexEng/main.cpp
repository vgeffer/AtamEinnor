#include <chrono>
#include <ctime>

#include "game/Game.hpp"
#include "Platform.hpp"
#include "Common.hpp"


int main(int argc, char *argv[]) {



    Window win;
    VideoMode mode;
    FrameBuffer fbuf; //IMPORTANT!!1!!1: Colors are ARGB!!!1!
    SDL_Event e;

    bool keymap[255]; //Keyboard map

    auto prev = std::chrono::system_clock::now();
    auto now = std::chrono::system_clock::now();


    mode = {800, 600, false, false};

    //TODO: EDIT THIS TO ALLOW RES
    if(CreateWindow(mode, &win) > OK) return -1;
    if(CreateFrameBuffer(mode, &fbuf) > OK) return -1;

    //Seed RNG
    std::time_t t = std::time(0);   // get time now
    std::tm* tm_now = std::localtime(&t);
    srand((tm_now->tm_year - tm_now->tm_yday) * tm_now->tm_sec + (tm_now->tm_wday * tm_now->tm_min) - tm_now->tm_sec * tm_now->tm_mday);

    //clear the keymap
    for(int i = 0; i < 255; i++)
        keymap[i] = false;

    //===========================
    // Create game-related stuff
    //===========================
    
    CreateCam(c_plrcam); 
    AssignTarget(c_plrcam, &fbuf);



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
                    keymap[e.key.keysym.sym & 255] = true;
                    break;

                case SDL_KEYUP:
                    keymap[e.key.keysym.sym & 255] = false;
                    break;

                case SDL_QUIT:
                    goto quit;
            }
        }



        for(int i = 0; i < 255; i++) {
            

            //Pass through "holding keys" 
        }


        PushFrame(&fbuf, &win);
    }

    //Needed for some things
    quit:

    //Cleanup
    DestroyFrameBuffer(&fbuf);
    DestroyWindow(&win);

    return 0;
}




