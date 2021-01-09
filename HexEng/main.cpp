#include <chrono>
#include <ctime>

#include "Platform.hpp"
#include "Common.hpp"


int main(int argc, char *argv[]) {

    Window win;
    uint32_t* fbuffer; //IMPORTANT!!1!!1: Colors are ARGB!!!1!
    SDL_Event e;

    auto prev = std::chrono::system_clock::now();
    auto now = std::chrono::system_clock::now();



    //TODO: EDIT THIS TO ALLOW RES
    if(CreateWindow({800,600, true, false}, &win) > OK) return -1;
    fbuffer = (uint32_t*)malloc(800 * 600 * sizeof(uint32_t));


    //Seed RNG
    std::time_t t = std::time(0);   // get time now
    std::tm* tm_now = std::localtime(&t);
    srand((tm_now->tm_year - tm_now->tm_yday) * tm_now->tm_sec + (tm_now->tm_wday * tm_now->tm_min) - tm_now->tm_sec * tm_now->tm_mday);


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