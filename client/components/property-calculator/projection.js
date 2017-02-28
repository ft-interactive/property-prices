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
	    return "translate("+ .5*getSquareDiagonal(getSquareSize(getRefArea())) +", 0) rotate(45)" 
	});

	svg.attr('height', svg.node().getBBox().height);

	window.addEventListener('resize', function(){
		updateVisualisation(svg, rect);
	});//Weird error on resize up, but not down >> module oFooter Cannot read property 'removeEventListener' of undefined
}

function getSquareSize(area) {
	var ratio = getContainer().offsetWidth/Math.sqrt(2*getRefArea());
	return ratio*Math.sqrt(area);
}

function getSquareDiagonal(squareSide) {
	return Math.sqrt(2*squareSide*squareSide);
}

function updateVisualisation(svg, rect) {
	var area = rect.attr("data-area");
	rect
	.attr('width', getSquareSize(area))
	.attr('height', getSquareSize(area)) 
	.attr("transform", function(d) {
	    return "translate("+ .5*getSquareDiagonal(getSquareSize(getRefArea())) +", 0) rotate(45)" 
	});

	svg.attr('height', svg.node().getBBox().height);
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