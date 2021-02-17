//======================================
//
//  Common.hpp
//
//  Contains everything used across the engine
//
//======================================
#pragma once

//List of all error codes
enum ErrCode{

    OK = 0,
    GENERAL_ERROR = 1,
    INSUFFICIENT_MEMORY = 2,
    WRITE_OUT_OF_BOUNDS = 3,
    FILE_NOT_FOUND = 5,
    SDL_INIT_ERROR = 10

};

#define _NORETURN_ inline void
#define _ERRRETURN_ inline uint8_t
#define _INTRETURN_ inline int32_t
#define _UINTRETURN_ inline uint32_t


_UINTRETURN_ MIX_ALPHA(uint32_t col, uint32_t bckg) {
    float alpha = (float)((col >> 24) & 0xFF) / (float)0xFF;

    return (alpha * col) + ((1 - alpha) * bckg);
}

//======================================
//
// TODO
//
//======================================
//
//    Add this to credits:
//      Portions of this software are copyright © 2021 The FreeType
//      Project(www.freetype.org). All rights reserved.
