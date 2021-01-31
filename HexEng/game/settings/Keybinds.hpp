#pragma once
#include <stdint.h>

struct keybind_t{
    char action[8]; 
    uint16_t key;
};

struct keybindtable_t{
    void* s_keybindmem;
    int s_size;
};


uint8_t CreateKeybindTable(int size, keybindtable_t table);
uint8_t DestroyKeybindTable(keybindtable_t table);
uint8_t CreateKeybind(char action[8], int defKey);
uint8_t RebindAction(char action[8], int Key);
uint16_t GetKey(char action[8]);


