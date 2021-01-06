//======================================
//
//  Math.hpp
//
//  Contains math-related stuff
//
//======================================
#pragma once

#include <math.h>
#include "Common.hpp"



struct Mat2x2 {
    float content[2][2];
};

struct Vec2 {
    float x, y;
};

struct Vec3 {
    float x, y, z;
};




void Mat2DMakeRotation(float angle, Mat2x2* out){
    out->content[0][0] = cosf(angle);
    out->content[0][1] = sinf(angle);
    out->content[1][0] = -sinf(angle);
    out->content[1][1] = cosf(angle);
}
void Mat2DMultiply(Mat2x2* a, Mat2x2* b, Mat2x2* out){}
void Mat2DMultiplyVector(Mat2x2* a, Vec2* b, Vec2* out){}


void Vec2Multiply(Vec2* a, Vec2* b, Vec2* out){}
void Vec2Add(Vec2* a, Vec2* b, Vec2* out) {
    out->x = a->x + b->x;
    out->y = a->y + b->y;
}
