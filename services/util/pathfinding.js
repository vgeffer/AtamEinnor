module.exports = function pathfind(world, width, height, x1, y1, x2, y2){
	//pass 'covers' array as world
	//
	//returns a path from [x1, y1] to [x2, y2] for which no shorter path exists
	//path is an array with every single hexagon included in order one needs to go
	//each hexagon is described as a tuple array like this: [x, y]
	//both startpoint and endpoint are included in the returned path

	//array of sets holding all visited tiles (if we have already been here, there is certainly a shorter/equal path, we can skip the current one)
	const xmap = [];
	for (var i = 0; i < width; i++){
		xmap.push(new Set());
	}

	xmap[x1].add(y1);

	//first path has the start tile only
	paths = [[[x1, y1]]];

	while (paths.length !== 0){
		const newPathsArray = [];

		for (const path of paths){

			//load current tile (end of the path we want to try extending)
			const end = path[path.length - 1];

			for (const move of [moveUp, moveUpRight, moveDownRight, moveDown, moveDownLeft, moveUpLeft]){
				//make the move according to the currently chosen move function
				const next = move(...end, world);

				//console.log(next); //DEBUG

				//tile out of play area
				if (next[0] < 0 || next[1] < 0 || next[0] > width - 1 || next[1] > height - 1) continue;

				//tile mined/accessible
				if (world[next[1] * width + next[0]].hardness !== 0) continue;

				//tile has not been visited by the algo yet
				if (xmap[next[0]].has(next[1])) continue;

				//check for ladders if going up/down
				if (move === moveUp || move === moveDown){
					if (!(world[end[1] * width + end[0]] === "ladder" && world[next[1] * width + next[0]].item === "ladder")){
						continue;
					}
				}

				//register as visited
				xmap[next[0]].add(next[1]);
				
				//add tile to path (passed all rules)
				newPathsArray.push(path.concat([next]));

				//check if we reached the goal
				if (next[0] === x2 && next[1] === y2){
					return path.concat([next]);
				}
			}
		}

		//replace all paths with newly created and without failed
		paths = newPathsArray;
	
		//console.log(paths); //DEBUG
	}

	//while loop exited due to no suitable path to continue with - no path exists
	return null;
}



function moveUp(x, y){
	return [x, y - 2];
}
function moveUpRight(x, y){
	if (y % 2 === 0){
		return [x, y - 1];
	} else {
		return [x + 1, y - 1];
	}
}
function moveDownRight(x, y){
	if (y % 2 === 0){
		return [x, y + 1];
	} else {
		return [x + 1, y + 1];
	}
}
function moveDown(x, y){
	return [x, y + 2];
}
function moveDownLeft(x, y){
	if (y % 2 === 0){
		return [x - 1, y + 1];
	} else {
		return [x, y + 1];
	}
}
function moveUpLeft(x, y){
	if (y % 2 === 0){
		return [x - 1, y - 1];
	} else {
		return [x, y - 1];
	}
}