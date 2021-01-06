#include <chrono>

#include "Platform.hpp"
#include "Common.hpp"


int main(void) {

    Window win;
    uint32_t* fbuffer; //IMPORTANT!!1!!1: Colors are ARGB!!!1!
    SDL_Event e;

    auto prev = std::chrono::system_clock::now();
    auto now = std::chrono::system_clock::now();



    //TODO: EDIT THIS TO ALLOW RES
    CreateWindow({800,600, false, false}, &win);
    fbuffer = (uint32_t*)malloc(800 * 600 * sizeof(uint32_t));



    //Main Game Loop
    while(1) {

        //Do the timing
        now = std::chrono::system_clock::now();
        float elapsed = ((std::chrono::duration<float>)(now-prev)).count();
        now = prev;


        //Handle the controls

        while(SDL_PollEvent(&e) == 1){

            switch (e.type) {
                case SDL_QUIT:
                    goto quit;
            }
        }




        PushFrame(fbuffer, &win);
    }

    //Needed for some things
    quit:

    //Cleanup
    free(fbuffer);
    DestroyWindow(&win);

    return 0;
}