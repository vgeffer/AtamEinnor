#pragma once

#include "../../Math.hpp"
#include "../../Platform.hpp"

const float CAM_FIXED_PAN_SPEED = 100;


struct camera_t{
    Vec2 c_pos;
    Rectangle c_scrbord;
    FrameBuffer* c_target;
};


void CreateCam(camera_t* out);
void AssignTarget(camera_t* cam, FrameBuffer* target);