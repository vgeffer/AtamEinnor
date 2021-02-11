//======================================
//
//  Platform.hpp
//
//  Contains all platform-related shit
//
//======================================
#pragma once

//Uncomment this to force debug mode
//Otherwise, define it in g++
//#define __DEBUG__

//Esentialy title of the window
#ifdef __DEBUG__
    #define __BUILD_STRING__ "build 291220 - engine test"
#else
    #define __BUILD_STRING__ "HexEngTest0"
#endif

//Include SDL
#ifdef _WIN32
    #include <SDL2/SDL.h>
#else
    #include <SDL2/SDL.h>
#endif

//Err codes
#include "Common.hpp"

//Window struct
struct Window{
    SDL_Window* Window;
    SDL_Renderer* Renderer;
    SDL_Texture* ScreenBuffer;


    int W, H;
    char Flags;
};

//Video mode struct
struct VideoMode{
    int W, H;
    bool fs, vs;
};

struct FrameBuffer{
    int W, H;
    uint32_t* data;
};

int CreateWindow(VideoMode mode, Window* win);
int CreateFrameBuffer(VideoMode mode, FrameBuffer* fb);
void PushFrame(FrameBuffer* fb, Window* win);
int DestroyWindow(Window* win);
int DestroyFrameBuffer(FrameBuffer* fb);