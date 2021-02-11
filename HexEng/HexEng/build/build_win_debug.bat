@echo off

g++ ../main.cpp ../Platform.cpp ../Graphics.cpp -l SDL2 -l SDL2main -D __DEBUG__ -o ../bin/hex_eng_win_bxxxxxx.exe