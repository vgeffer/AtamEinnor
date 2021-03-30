module.exports = function pathfind(world, width, height, x1, y1, x2, y2){
	//pass 'covers' array as world
	//
	//returns a path from [x1, y1] to [x2, y2] for which no shorter path exists
	//path is an array with every single hexagon included in order one needs to go
	//each hexagon is described as a tuple array like this: [x, y]
	//both startpoint and endpoint are included in the returned path


	const xmap = [];
	for (var i = 0; i < width; i++){
		xmap.push(new Set());
	}

	xmap[x1].add(y1);

	paths = [[[x1, y1]]];

	while (paths.length !== 0){
		const newPathsArray = [];

		for (const path of paths){

			const end = path[path.length - 1];

			for (const move of [moveUp, moveUpRight, moveDownRight, moveDown, moveDownLeft, moveUpLeft]){
				
				const next = move(...end);

				console.log(next);

				if (next[0] < 0 || next[1] < 0 || next[0] > width - 1 || next[1] > height - 1) continue;

				if (world[next[1] * width + next[0]].hardness !== 0) continue;

				if (xmap[next[0]].has(next[1])) continue;

				xmap[next[0]].add(next[1]);
				
				newPathsArray.push(path.concat([next]));

				if (next[0] === x2 && next[1] === y2){
					return path.concat([next]);
				}
			}
		}

		paths = newPathsArray;
	
		console.log(paths);
	}

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