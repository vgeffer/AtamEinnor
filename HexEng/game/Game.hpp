//Just links everything


#pragma once

#include "Entity.hpp"
#include "player/Camera.hpp"

#include "settings/Keybinds.hpp"

camera_t* c_plrcam; //player camera

//Leave nullptr for c_plrcam
//Renders to entire FrameBuffer
void RenderImage(camera_t* c_cam);