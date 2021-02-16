#include "UI.hpp"


void UICore::AssignSurface(FrameBuffer* buffer) {
	UICore::buffer = buffer;
}

void UICore::Invalidate(UIElement* element) {
	UICore::invObjects.push_back(element);
}

void UICore::RedrawAll() {

	for (auto item : UICore::invObjects) {
		item->Draw(UICore::buffer);
	}

	UICore::invObjects.clear();
}


void UI_TextBox::Draw(FrameBuffer* buffer) {

}
