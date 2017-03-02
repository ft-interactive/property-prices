import * as d3 from 'd3';

var container, maxArea;
const cubeProjectionHeight = 15;
const bedReferenceDepth = 2.14;
const svgOffset = 25;

export function getProjection(area, maxArea, parent) {
	setContainer(parent);
	setRefArea(maxArea);

	var svg = d3.select(parent).append('svg').attr('class', 'property')
	var g = svg.append("g").classed('surface-container', true);
	var refContainer = svg.append("g")
	.classed("reference", true);

	var rect = g.append("rect")
    .attr("x", 0 )
    .attr("y", 0 )
    .attr("width", getSquareSize(area))
    .attr("height", getSquareSize(area))
    .attr("data-area", area);

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

	var reference = refContainer.append("use")
	.attr("xlink:href", "#bedMan")
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", 88)
	.attr("height", 64);

	window.addEventListener('resize', function(){
		updateVisualisation(svg, rect, outerCube, refContainer, reference);
	});//TODO: Weird error on resize up, but not down >> module oFooter Cannot read property 'removeEventListener' of undefined

	updateVisualisation(svg, rect, outerCube, refContainer, reference);
}

function getSquareSize(area) {
	var ratio = getContainer().offsetWidth/Math.sqrt(2*getRefArea());
	return ratio*Math.sqrt(area);
}

function getSquareDiagonal(squareSide) {
	return Math.sqrt(2*Math.pow(squareSide, 2));
}

function updateVisualisation(svg, rect, outerCube, refContainer, reference) {
	var area = rect.attr("data-area");
	var diagonal = getSquareDiagonal(getSquareSize(getRefArea()));
	var slider = document.querySelector('.property-value-slider input');
	var stepNum = .5*(1 + (slider.value - slider.min)/slider.step);
	var referenceScale = (1/stepNum)*Math.round(getContainer().offsetWidth)/parseInt(getComputedStyle(getContainer(), null).maxWidth);

	rect
	.attr('width', getSquareSize(area))
	.attr('height', getSquareSize(area)) 
	.attr("transform", function(d) {
	    return "translate("+ .5*diagonal +", "+(referenceScale*svgOffset)+") rotate(45)"; 
	});

	var cube = outerCube.select('.cube-edges');
	cube.attr("transform", "translate("+ (getSquareSize(area) + cubeProjectionHeight) +", 0)");

	outerCube.select('.dark-face').attr("height", getSquareSize(area));
	outerCube.select('.light-face').attr("height", getSquareSize(area));

	var containerSize = outerCube.select('.cube-edges').node().getBBox();
	var borderTranslation = [.5*(getSquareDiagonal(containerSize.width) + diagonal) , .5*getSquareDiagonal(containerSize.height) + referenceScale*svgOffset];
	outerCube.attr("transform", "translate("+ borderTranslation[0] +", "+ borderTranslation[1] +") rotate(135)");

	reference.attr("transform", "scale("+referenceScale+","+referenceScale+")");

	var xPos = .5*(diagonal - getSquareDiagonal(getSquareSize(area))) + referenceScale*cubeProjectionHeight;
	var yPos = referenceScale*svgOffset + .5*(svg.node().getBBox().height - referenceScale*svgOffset) - refContainer.node().getBBox().height + cubeProjectionHeight;

	refContainer.attr("transform", "translate("+xPos+","+yPos+") ");

	svg.attr('height', svg.node().getBBox().height + referenceScale*svgOffset);
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