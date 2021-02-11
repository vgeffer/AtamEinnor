#include "Game.hpp"
#include <assert.h>

void RenderImage(camera_t* c_cam){

    if(c_cam == nullptr)
        c_cam = &c_plrcam;

    //Call all rendering functions

    
    //DEBUG ASSERTION - not null render target
    assert(c_cam->c_target != nullptr);





}