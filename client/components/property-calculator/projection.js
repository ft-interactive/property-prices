import * as d3 from 'd3';
import * as axonometric from 'd3-axonometric';

export function square() {
	//the bigest square is a square of side max area (mA), this sets the viewbox;
	var maxArea = undefined;
	var areaAccessor = function(d){ return area; }
	var boundary = axonometric.axonometricBounds();
	var pathGenerator = axonometric.axonometricPath();
	var margin = {top:10,left:10,bottom:10,right:10}
	var comparison = [{
			position:[0,0,0],
			id:'#bed',
		},
		{
			position:[0,0,0],
			id:'#person',
		}];

	function drawSquare(parent){
		//work out the viewport required
		if(maxArea === undefined){ maxArea = d3.max(parent.data(), areaAccessor); }
		var bounds = boundary( pointsList(squareCoords(maxArea)) );
		
		parent.transition()
			.attr('viewBox', [bounds.x-5, bounds.y-10, bounds.width+10, bounds.height+20]);

		parent.selectAll('path')
			.data(function(d){ 
				return squareCoords( areaAccessor(d) ); 
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
				console.log(d.shape); 
				return pathGenerator(d.shape) + 'z'; 
			});
		
		parent.selectAll('use')
			.data()
			.enter()

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

	return drawSquare;
}

function pointsList(faces){
	return faces.reduce(function(points,current){
		return points.concat(current.shape);
	},[]);
}

function squareCoords(area){
	var sideLength = Math.sqrt(area) * 5;
	var squareThickness = 3;
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
