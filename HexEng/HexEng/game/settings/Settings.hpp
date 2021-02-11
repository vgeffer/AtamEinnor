#pragma once

#include <stdint.h>
#include <map>
#include <iostream>
#include <fstream>
#include <string>
#include <SDL2/SDL.h>
#include "../../Common.hpp"

const std::string splitchr = ":";


class Keyboard {

public:
    void CreateKeybind(std::string action, uint32_t defKey) {
        keymap[action] = defKey;
    }
    uint32_t GetKey(std::string action) {
        return keymap[action];
    }

private:
    std::map<std::string, uint32_t> keymap;
};

_NORETURN_ LoadKeybinds(Keyboard* kbr) {
    
    size_t pos = 0;
    std::string token;

    std::ifstream cfg("./keyboard.cfg");

    if (!cfg.is_open()) {

        std::ofstream cfg_out("./keyboard.cfg");

        cfg_out << "CAM_U:" + std::to_string(SDLK_w) + "\n";
        cfg_out << "CAM_D:" + std::to_string(SDLK_s) + "\n";
        cfg_out << "CAM_L:" + std::to_string(SDLK_a) + "\n";
        cfg_out << "CAM_R:" + std::to_string(SDLK_d) + "\n";
        
        //DEBUG STATEMENT
        cfg_out << "DBG_EX:" + std::to_string(SDLK_F1) + "\n";
        cfg_out << "DBG_KY:" + std::to_string(SDLK_F2) + "\n";


        cfg_out.close();
        LoadKeybinds(kbr);
        return;
    }
        
    for (std::string line; getline(cfg, line);) {
        
        pos = line.find(splitchr);
        token = line.substr(0, pos);
        line.erase(0, pos + splitchr.length());

        kbr->CreateKeybind(token, std::atoi(line.c_str()));
    }


    cfg.close();
    return;
}

_NORETURN_ SaveKeybinds(Keyboard* kbr) {
    std::ofstream cfg_out("./keyboard.cfg");

    cfg_out << "CAM_U:" + std::to_string(kbr->GetKey("CAM_U")) + "\n";
    cfg_out << "CAM_D:" + std::to_string(kbr->GetKey("CAM_D")) + "\n";
    cfg_out << "CAM_L:" + std::to_string(kbr->GetKey("CAM_L")) + "\n";
    cfg_out << "CAM_R:" + std::to_string(kbr->GetKey("CAM_R")) + "\n";


    //DEBUG STATEMENT
    cfg_out << "DBG_EX:" + std::to_string(SDLK_F1) + "\n";
    cfg_out << "DBG_KY:" + std::to_string(SDLK_F2) + "\n";

    cfg_out.close();
    return;
}
