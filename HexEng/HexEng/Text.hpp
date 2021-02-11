#pragma once

#include <iostream>
#include <map>
#include <string>


#include "Math.hpp"
#include "Platform.hpp"
#include "Graphics.hpp"
#include "Common.hpp"


struct Font{
    Sprite* font;
    std::map<char, Rectangle> charMap;
};



void DrawText(std::string text, uint8_t size, Font* font, FrameBuffer* fb);
void LoadFont(const char* path, Font* font);