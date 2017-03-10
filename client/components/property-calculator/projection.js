import * as d3 from 'd3';
import * as axonometric from 'd3-axonometric';



export function square() {
	//the bigest square is a square of side max area (mA), this sets the viewbox;
	var scale = 5; //SVG pixels per meter
	var maxArea = undefined;
	var areaAccessor = function(d){ return area; }
	var projection = axonometric.axonometricProjection()
		.angle(Math.PI/8);
	var boundary = axonometric.axonometricBounds()
		.projection(projection);

	var pathGenerator = axonometric.axonometricPath()
		.projection(projection);

	var lineGenerator = axonometric.axonometricLine()
		.projection(projection);

	var margin = {top:10,left:10,bottom:10,right:10}



	function drawSquare(parent){
		//work out the viewport required
		if(maxArea === undefined){ maxArea = d3.max(parent.data(), areaAccessor); }
		var bounds = boundary( pointsList(squareCoords(maxArea, scale)) );

		parent.transition()
			.attr('viewBox', [bounds.x-5, bounds.y-10, bounds.width+10, bounds.height+20]);
		
		parent.select('.comparison-image')
			.attr('transform',function(d){
				console.log(areaAccessor(d));
			});


		parent.selectAll('path')
			.data(function(d){ 
				return squareCoords( areaAccessor(d), scale ); 
			})
			.enter()
			.append('path')
				.attr('vector-effect','non-scaling-stroke')
				.attr('class', function(d){
					return d.class; 
				});

		parent.selectAll('path')
			.transition()
			.attr('d', function(d){
				return pathGenerator(d.shape) + 'z'; 
			});

		parent.selectAll('line') //TODO remove this bit (effectively jsut a marker for where the bed should go)
			.data(function(d){
				var coords = squareCoords(areaAccessor(d),scale)[2].shape; //get the top face coords
				var bedAspect = 0.78;//the 'aspect ratio' of the beds sides
				console.log(coords);
				var start1 = [...coords[3]]; //left most position of the square

				var start2 = [...coords[3]];
				start2[2] -= bedAspect * scale;

				var end1 = [...start1];
				end1[1] += bedAspect * scale;
				end1[0] += 2.17 * scale;

				var end2 = [...end1];
				end2[2] += bedAspect * scale;
				console.log( boundary([start1, end1]) )
				return [lineGenerator(start1,end1),lineGenerator(start2,end2)];
			})
			.enter()
			.append('line').attr('class','ref');

		parent.selectAll('use')
			.data(function(d){
				var coords = squareCoords(areaAccessor(d),scale)[2].shape; //get the top face coords
				var bedAspect = 0.78;//the 'aspect ratio' of the beds sides
				var start = [...coords[3]]; //left most position of the square
				var end = [...start];
				end[0] += 2.17 * scale;
				end[1] += bedAspect * scale;
				var anchor = projection(start);
				var bedBounds = boundary([start, end]);
				return {
					x:anchor[0],
					y:anchor[1],
					width:bedBounds.width,
				};
			})

		parent.selectAll('line')
			.transition()
			.attr('x1', d=>d.x1)
			.attr('y1', d=>d.y1)
			.attr('x2', d=>d.x2)
			.attr('y2', d=>d.y2);

	}

	drawSquare.areaAccessor = function(x){
		if(x===undefined) return areaAccessor;
		areaAccessor = x;
		return drawSquare;		
	}

	drawSquare.maxArea = function(x){
		if(x===undefined) return maxArea;
		maxArea = x;
		return drawSquare;
	}

	drawSquare.scale = function(x){
		if(x===undefined) return scale;
		scale = x;
		return drawSquare;
	}

	drawSquare.projection = function(){
		return projection;
	}

	return drawSquare;
}

//from a set of faces return a list of points [[x,y,z],[x,y,z],etc...]
function pointsList(faces){ 
	return faces.reduce(function(points,current){
		return points.concat(current.shape);
	},[]);
}

function squareCoords(area, scale){
	if(scale === undefined) scale=1;
	var sideLength = Math.sqrt(area) * scale;
	var squareThickness = scale/5 * 3;
	var topFace = [
		[-sideLength, squareThickness, -sideLength],
		[0, squareThickness, -sideLength],
		[0, squareThickness, 0],
		[-sideLength, squareThickness, 0] ];

	var leftFace = [
		[-sideLength, squareThickness, 0],
		[0, squareThickness, 0],
		[0, 0, 0],
		[-sideLength, 0, 0] ];

	var rightFace = [
		[0, squareThickness, 0],
		[0, squareThickness, -sideLength],
		[0, 0, -sideLength],
		[0, 0, 0] ];

	return [ 
		{'class':'dark-face',shape:leftFace},
		{'class':'light-face',shape:rightFace},
		{'class':'top-face', shape:topFace} 
	];
}
