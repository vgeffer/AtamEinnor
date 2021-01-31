#pragma once

#include "../Graphics.hpp"
#include "../Math.hpp"


struct entity_t {
    uint32_t spr;
    Vec2 WorldPos; //Relative to world origin at [0, 0]
};