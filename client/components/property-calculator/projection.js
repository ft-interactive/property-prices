import * as d3 from 'd3';
import * as axonometric from 'd3-axonometric';
import { comparison } from './comparison-paths'



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

//		var comparisonNodes = d3.select('symbol#bedMan g').node().innerHTML;

		parent.transition()
			.attr('viewBox', [bounds.x-5, bounds.y-10, bounds.width+10, bounds.height+20]);
		

		parent.selectAll('path')
			.data(function(d){ 
				return squareCoords( areaAccessor(d), scale ); 
			})
			.enter()
			.append('path')
				.attr('vector-effect','non-scaling-stroke')
				.attr('class', function(d){
					return d.class + ' cuboid-face'; 
				});

		parent.selectAll('path.cuboid-face')
			.transition()
			.attr('d', function(d){
				return pathGenerator(d.shape) + 'z'; 
			});



		parent.selectAll('g.comparison-container')
			.data(function(d){
				var coords = squareCoords(areaAccessor(d),scale)[2].shape; //get the top face coords
				var bedAspect = 0.78;//the 'aspect ratio' of the beds sides
				var start = [...coords[3]]; //left most position of the square
				var end = [...start];
				end[0] += 2.17 * scale;
				end[1] += bedAspect * scale;
				var bedBounds = boundary([start, end]);				
				start[1] = scale*1.4;
				var anchor = projection(start);

				return [{
					anchor:anchor,
					width:bedBounds.width,
				}];
			}).enter()
				.append('g')
					.attr('class','comparison-container')
					.attr('transform',function(d){
						return 'translate(' +d.anchor+ ') scale(3.8)';
					})
					.html( comparison );


		parent.selectAll('g.comparison-container')
			.transition()
			.attr('transform',function(d){
				return 'translate(' +d.anchor+ ') scale(3.9)';
			});


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
