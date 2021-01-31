#pragma once

#include <cstdint>
#include "../Math.hpp"
#include "../Common.hpp"

struct worldmap_t {

   uintptr_t* ppi;
};


int GenerateWorld(uint64_t n_seed, worldmap_t* p_map, Vec2 v_abegin, Vec2 v_aend);
