//Just links everything


#pragma once

#include <thread>

#include "Entity.hpp"
#include "player/Camera.hpp"

#include "settings/Settings.hpp"


class Renderer {
public:

	camera_t c_plrcam;



	void DrawFrame(camera_t* cam);

	

private:

	void thread_spin(void(* rnd_method)());

	std::thread gfx_rnd_light( thread_spin, &DrawLights);
	std::thread gfx_rnd_back;
	std::thread gfx_rnd_ent;
	std::thread gfx_rnd_front;
	std::thread gfx_rnd_ui;
	

	void DrawLights();


	
};