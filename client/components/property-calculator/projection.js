/** Adapted from https://github.com/tomgp/boxy/tree/master/source **/
import * as d3 from 'd3';

var container, maxArea;

export function getProjection(area, maxArea, parent) {
	setContainer(parent);
	setRefArea(maxArea);

	var svg = d3.select(parent).append('svg').attr('class', 'property');
	var rect = svg.append("rect")
    .attr("x", 0 )
    .attr("y", 0 )
    .attr("width", getSquareSize(area))
    .attr("height", getSquareSize(area))
    .attr("data-area", area)
    .classed('surface', true)
    .style('stroke-width', 2)
    .style('stroke', 'white')
    .style('fill', 'none')
    .attr("transform", function(d) {
	    return "translate("+ .5*getSquareDiagonal(getSquareSize(area)) +", 0) rotate(45)" 
	});
	window.addEventListener('resize', function(){
		updateVisualisation(rect);
	});//Weird error on resize up, but not down
}

function getSquareSize(area) {
	var ratio = getContainer().offsetWidth/Math.sqrt(2*getRefArea());
	return ratio*Math.sqrt(area);
}

function getSquareDiagonal(squareSide) {
	return Math.sqrt(2*squareSide*squareSide);
}

function updateVisualisation(rect) {
	var area = rect.attr("data-area");
	rect
	.attr('width', getSquareSize(area))
	.attr('height', getSquareSize(area)) 
	.attr("transform", function(d) {
	    return "translate("+ .5*getSquareDiagonal(getSquareSize(area)) +", 0) rotate(45)" 
	});
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