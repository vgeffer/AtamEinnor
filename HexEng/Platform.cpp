#include "Platform.hpp"



int CreateWindow(VideoMode mode, Window* win) {

	if (SDL_Init(SDL_INIT_VIDEO) < 0) {
		return ErrCode::SDL_INIT_ERROR;
	}

	win->Window = SDL_CreateWindow(__BUILD_STRING__, 200, 200, mode.W, mode.H, 0);
	win->Renderer = SDL_CreateRenderer(win->Window , -1, mode.vs ? SDL_RENDERER_PRESENTVSYNC : 0);

	if (!(win->Window)){
		return ErrCode::SDL_INIT_ERROR;
	}

	win->ScreenBuffer = SDL_CreateTexture(win->Renderer,SDL_PIXELFORMAT_ARGB8888, SDL_TEXTUREACCESS_STATIC, mode.W, mode.H);

	win->W = mode.W;
	win->H = mode.H;
	win->Flags = mode.vs << 1 | mode.fs;

    return ErrCode::OK;
}



void PushFrame(uint32_t* fbuffer, Window* win) {
	SDL_UpdateTexture(win->ScreenBuffer, NULL, fbuffer, win->W * sizeof(Uint32));
	SDL_RenderClear(win->Renderer);
    SDL_RenderCopy(win->Renderer, win->ScreenBuffer, NULL, NULL);
    SDL_RenderPresent(win->Renderer);
}



int DestroyWindow(Window* win) {

	//Destroy window
	SDL_DestroyTexture(win->ScreenBuffer);
	SDL_DestroyWindow(win->Window);
	SDL_DestroyRenderer(win->Renderer);
	//Quit SDL subsystems

	SDL_Quit();


	return ErrCode::OK;

}

