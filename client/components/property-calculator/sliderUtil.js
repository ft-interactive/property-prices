import {getSymbolFromCurrency} from 'currency-symbol-map';
import axios from 'axios';

const sliderThumbWidth = 28; //this is the value for chrome
const sliderContainer = document.querySelector('.property-value-slider');
const slider = document.querySelector('.property-value-slider input');
const output = document.querySelector('.property-value-slider output');
const valueInput = document.getElementById('amountInput');
const sliderMin = document.querySelector('.slider-range.range-min');
const sliderMax = document.querySelector('.slider-range.range-max');
var selectedCurrency ='GBP';

export function initSlider(){
	slider.addEventListener('input', function(){
		setOutput();
	});

	sliderMin.textContent = translateValue(slider.getAttribute("min"));
	sliderMax.textContent = translateValue(slider.getAttribute("max"));

	setOutput();
}

export function updateSlider(currency) {
	selectedCurrency = currency;

	if(selectedCurrency === 'GBP') updateRangeToNearest500K(1);
	else translateRange();
}

function setOutput(){
	const outputRect = output.getBoundingClientRect();
	const inputRect = slider.getBoundingClientRect();

	const xPosition = ((slider.value - slider.min) / (slider.max - slider.min))*(inputRect.width - outputRect.width*.5) - sliderThumbWidth*.5;
	output.innerHTML =  getSymbolFromCurrency(getCurrency()) + translateValue(slider.value);
	output.style = 'left:'+xPosition+'px;';

	valueInput.value = slider.value*1000000;
}

function translateRange(){
	var endpoint = 'http://markets.ft.com/research/webservices/securities/v1/quotes?symbols=GBP' + getCurrency() +'&source=54321';

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
	
	slider.setAttribute("min", newMin);
	slider.setAttribute("max", newMax);

	//TODO: update step and value to keep slider position

	sliderMin.textContent = translateValue(newMin);
	sliderMax.textContent = translateValue(newMax);

	setOutput();
}

function getCurrency() {
	return selectedCurrency;
}

function translateValue(value) {
	var amount = value*1000000;
	var readableAmount;

	if(amount>=1000000000) {
		readableAmount = (amount/1000000000).toFixed(1) + 'b';
	}
	else if(amount >=1000000 && amount < 1000000000) {
		readableAmount = amount/1000000 + 'm';
	} else {
		readableAmount = amount/1000 +'k';
	}

	return readableAmount;
}