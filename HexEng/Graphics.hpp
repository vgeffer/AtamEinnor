//======================================
//
//  Rasterizer.hpp
//
//  Contains all graphics-related shit
//
//======================================
#pragma once

#include <iostream>
#include <fstream>

#include "Platform.hpp"
#include "Math.hpp"
#include "Common.hpp"


enum SamplingType{
    NEAREST_NEIGHBOR = 0,

};


struct Sprite{

    int W, H;
    uint32_t* data;

    unsigned char sampling;

    Vec2 position;
    Vec2 trasformOrigin;
    Mat2x2 transformMatrix;
};


void DrawTransformed(Sprite* spr, FrameBuffer* fb);
void DrawRaw(Sprite* spr, FrameBuffer* fb);


int LoadSprite(const char* path, Sprite* spr);
void DestroySprite(Sprite* spr);
