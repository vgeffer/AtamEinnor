#pragma once

#include <vector>
#include "../../Graphics.hpp"
#include "../../Math.hpp"

class UICore {


public:
	void Invalidate(UIElement* element);

private:
	std::vector<UIElement> invObjects;

};


//just for overriding
class UIElement {
public:
	Vec2 ScrPos; //-1 to 1, translated to W, H at drawing
	virtual void Draw() = 0;
};