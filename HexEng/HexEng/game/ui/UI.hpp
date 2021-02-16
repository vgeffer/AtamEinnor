#pragma once

#include <iostream>
#include <SDL2/SDL.h>
#include <SDL2/SDL_ttf.h>
#include <vector>
#include "../player/Camera.hpp"
#include "../../Graphics.hpp"
#include "../../Math.hpp"


#pragma region UICore 

//just for overriding
class UIElement {
public:
	Vec2 ScrPos; //-1 to 1, translated to W, H at drawing
	virtual void Draw(FrameBuffer* buffer) = 0;
};

class UICore {

public:
	void Invalidate(UIElement* element);
	void AssignSurface(FrameBuffer* buffer);
	void RedrawAll();

private:
	std::vector<UIElement*> invObjects;
	FrameBuffer* buffer = nullptr;
};

#pragma endregion

#pragma region UIElements

class UI_TextBox : public UIElement {

public:
	void Draw(FrameBuffer* buffer) override;

	Vec2 position;
	std::string Text;
	TTF_Font* Font;
};



#pragma endregion