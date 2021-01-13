#include "Platform.hpp"



int CreateWindow(VideoMode mode, Window* win) {

	if (SDL_Init(SDL_INIT_VIDEO) < 0) {
		return ErrCode::SDL_INIT_ERROR;
	}

	//Create a window and a Renderer that will draw to it
	win->Window = SDL_CreateWindow(__BUILD_STRING__, 200, 200, mode.W, mode.H, mode.fs ? SDL_WINDOW_FULLSCREEN : 0);
	win->Renderer = SDL_CreateRenderer(win->Window , -1, mode.vs ? SDL_RENDERER_PRESENTVSYNC : 0);

	if (!(win->Window)){
		return ErrCode::SDL_INIT_ERROR;
	}

	//Create the fbuffer texture
	win->ScreenBuffer = SDL_CreateTexture(win->Renderer,SDL_PIXELFORMAT_ARGB8888, SDL_TEXTUREACCESS_STATIC, mode.W, mode.H);

	//Save properties and flags
	win->W = mode.W; 
	win->H = mode.H;
	win->Flags = mode.vs << 1 | mode.fs;

    return ErrCode::OK;
}

int CreateFrameBuffer(VideoMode mode, FrameBuffer* fb) {

	fb->W = mode.W;
	fb->H = mode.H;
	fb->data = NULL;

	fb->data = (uint32_t *)malloc(mode.W * mode.H * sizeof(uint32_t));
	if(!(fb->data))return ErrCode::INSUFFICIENT_MEMORY;
	return ErrCode::OK;
}


//Update the screen
void PushFrame(FrameBuffer* fb, Window* win) {
	SDL_UpdateTexture(win->ScreenBuffer, NULL, fb->data, win->W * sizeof(Uint32));
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

int DestroyFrameBuffer(FrameBuffer* fb){
	fb->W = 0;
	fb->H = 0;
	free(fb->data);
	
	fb->data = NULL;
	return ErrCode::OK;
}