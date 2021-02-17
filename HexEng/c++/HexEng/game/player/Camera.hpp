#pragma once

#include "../../Math.hpp"
#include "../../Platform.hpp"

const float CAM_FIXED_PAN_SPEED = 100;


struct camera_t{
    Vec2 c_pos;
    FrameBuffer* c_target;
};

_NORETURN_ CreateCam(camera_t* out) {
    out->c_pos = {0, 0};
    out->c_target = nullptr;
}
_NORETURN_ AssignTarget(camera_t* cam, FrameBuffer* target) {
    cam->c_target = target;
}

