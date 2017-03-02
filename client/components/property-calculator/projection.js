/** Adapted from https://github.com/tomgp/boxy/tree/master/source **/
import * as d3 from 'd3';

var container, maxArea;

const cubeProjectionHeight = 15;

export function getProjection(area, maxArea, parent) {
	setContainer(parent);
	setRefArea(maxArea);

	var svg = d3.select(parent).append('svg').attr('class', 'property')
	var g = svg.append("g").classed('surface-container', true);

	var diagonal = getSquareDiagonal(getSquareSize(getRefArea()));

	var rect = g.append("rect")
    .attr("x", 0 )
    .attr("y", 0 )
    .attr("width", getSquareSize(area))
    .attr("height", getSquareSize(area))
    .attr("data-area", area)
    .attr("transform", function(d) {
	    return "translate("+.5*diagonal+", 0) rotate(45)"; 
	});


	var outerCube = g.append("g");
	var cube = outerCube.append("g").classed('cube-edges', true);

	cube.append("rect")
	.attr("width", cubeProjectionHeight)
	.attr("height", getSquareSize(area))
	.classed("dark-face", true)
	.attr("transform", function(d) {
	    return "translate(-"+cubeProjectionHeight+","+cubeProjectionHeight+") skewY(-45)"; 
	});

	cube.append("rect")
	.attr("width", cubeProjectionHeight)
	.attr("height", getSquareSize(area))
	.classed("light-face", true)
	.attr("transform", function(d) {
	    return "rotate(90) skewY(45)"; 
	});

	cube.attr("transform", "translate("+ (getSquareSize(area) + cubeProjectionHeight) +", 0)");
	
	var containerSize = outerCube.node().getBBox();

	var borderTranslation = [.5*(getSquareDiagonal(containerSize.width) + diagonal), .5*getSquareDiagonal(containerSize.height)];
	outerCube.attr("transform", "translate("+ borderTranslation[0] +", "+ borderTranslation[1] +") rotate(135)");

	svg.attr('height', outerCube.node().getBBox().height);

	window.addEventListener('resize', function(){
		updateVisualisation(svg, rect, outerCube);
	});//TODO: Weird error on resize up, but not down >> module oFooter Cannot read property 'removeEventListener' of undefined
}

function getSquareSize(area) {
	var ratio = getContainer().offsetWidth/Math.sqrt(2*getRefArea());
	return ratio*Math.sqrt(area);
}

function getSquareDiagonal(squareSide) {
	return Math.sqrt(2*squareSide*squareSide);
}

function updateVisualisation(svg, rect, outerCube) {
	var area = rect.attr("data-area");
	var diagonal = getSquareDiagonal(getSquareSize(getRefArea()));

	rect
	.attr('width', getSquareSize(area))
	.attr('height', getSquareSize(area)) 
	.attr("transform", function(d) {
	    return "translate("+ .5*diagonal +", 0) rotate(45)"; 
	});

	var cube = outerCube.select('.cube-edges');
	cube.attr("transform", "translate("+ (getSquareSize(area) + cubeProjectionHeight) +", 0)");

	outerCube.select('.dark-face').attr("height", getSquareSize(area));
	outerCube.select('.light-face').attr("height", getSquareSize(area));

	var containerSize = outerCube.select('.cube-edges').node().getBBox();
	var borderTranslation = [.5*(getSquareDiagonal(containerSize.width) + diagonal) , .5*getSquareDiagonal(containerSize.height)];
	outerCube.attr("transform", "translate("+ borderTranslation[0] +", "+ borderTranslation[1] +") rotate(135)");

	svg.attr('height', outerCube.node().getBBox().height);
}

function getRefArea() {
	return maxArea
}

function setRefArea(mA) {
	maxArea = mA;
}

function getContainer() {
	return container;
}

function setContainer(element) {
	container = element;
}