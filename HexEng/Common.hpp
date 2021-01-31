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

//======================================
//
//  Interdev Msg Board
//
//======================================
//
//  Hugo. Nebudem pouzivat classy v game code
//  Structy sa lajsie serializuju
//      -V