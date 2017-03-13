import {getSymbolFromCurrency} from 'currency-symbol-map';
import axios from 'axios';



const sliderThumbWidth = 28; //this is the value for chrome
const sliderContainer = document.querySelector('.property-value-slider');
const slider = document.querySelector('.property-value-slider input');
const output = document.querySelector('.property-value-slider output');
const valueInput = document.querySelector('#amountInput');
const sliderMin = document.querySelector('.slider-range.range-min');
const sliderMax = document.querySelector('.slider-range.range-max');
const propertyFormSubmit = document.querySelector('#propertyCalculator input[type="submit"]');

var selectTimeout;
var selectedCurrency ='GBP';

export function initSlider(){
	slider.addEventListener('input', function(){
		setOutput();
	});

	sliderMin.textContent = translateValue(slider.getAttribute("min") * 1000000);
	sliderMax.textContent = translateValue(slider.getAttribute("max") * 1000000);

	window.addEventListener('resize', function(){
		setOutput(true);
	});

	setOutput();
}

export function updateSlider(currency) {
	selectedCurrency = currency;

	if(selectedCurrency === 'GBP') updateRangeToNearest500K(1);
	else translateRange();
}

function setOutput(noReload){
	clearTimeout(selectTimeout);
	const outputRect = output.getBoundingClientRect();
	const inputRect = slider.getBoundingClientRect();
	var currencySymbol = ((getSymbolFromCurrency(getCurrency())!== undefined)?getSymbolFromCurrency(getCurrency()):getCurrency()+' ');

	const xPosition = ((slider.value - slider.min) / (slider.max - slider.min))*(inputRect.width - outputRect.width*.5) - sliderThumbWidth*.5;
	output.innerHTML =  currencySymbol + translateValue(slider.value * 1000000);
	output.style = 'left:'+xPosition+'px;';

	valueInput.value = slider.value*1000000;

	if(!noReload) {
		selectTimeout = setTimeout(function(){
			propertyFormSubmit.click();
			clearTimeout(selectTimeout);
		}, 500);
	}
}

function translateRange(){
	var endpoint = 'http://markets.ft.com/research/webservices/securities/v1/quotes?symbols=GBP' + getCurrency() +'&source=5d32d7c412';

	axios.get(endpoint)
		.then(function (response) {
		updateRangeToNearest500K(response.data.data.items[0].quote.lastPrice);
		})
		.catch(function (error) {
		console.log(error);
		});
}

function updateRangeToNearest500K(exchangeRate) {
	var newMin = Math.round(exchangeRate)*.5;
	var newMax = Math.round(10*exchangeRate);
	var stepNum = (slider.value - slider.min)/slider.step;
	var newStep = getSteps(newMin, newMax);

	slider.setAttribute("min", newMin);
	slider.setAttribute("max", newMax);
	slider.setAttribute("step", newStep);
	slider.value = newMin + stepNum*newStep;

	sliderMin.textContent = translateValue(newMin * 1000000);
	sliderMax.textContent = translateValue(newMax * 1000000);

	setOutput();
}

function getSteps(valMin, valMax) {
	var delta = valMax - valMin;
	var stepAmount = delta/25;

	if(stepAmount < 1) {
		return .5;
	} else {
		return stepAmount;
	}
}

function getCurrency() {
	return selectedCurrency;
}

export function translateValue(value, precision = 2) {
	var amount = value;
	var readableAmount;

	if(amount>=1000000000) {
		readableAmount = (amount/1000000000).toFixed(precision) + 'b';
	} else if(amount >=100000000 && amount < 1000000000) {
		readableAmount = Math.round(amount/1000000) + 'm';
	}
	else if(amount >=1000000 && amount < 100000000) {
		readableAmount = amount/1000000 + 'm';
	} else {
		readableAmount = amount/1000 +'k';
	}

	return readableAmount;
}