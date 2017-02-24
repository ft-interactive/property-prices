export function initSlider(selector){
	const sliderThumbWidth = 28; //this is the value for chrome
	const sliderContainer = document.querySelector(selector);
	const slider = document.querySelector(selector + ' input');
	const output = document.querySelector(selector + ' output');
	const valueInput = document.getElementById('amountInput');
	const sliderMin = document.querySelector('.slider-range.range-min');
	const sliderMax = document.querySelector('.slider-range.range-max');

	function setOutput(){
		const outputRect = output.getBoundingClientRect();
		const inputRect = slider.getBoundingClientRect();

		const xPosition = ((slider.value - slider.min) / (slider.max - slider.min))*(inputRect.width - outputRect.width*.5) - sliderThumbWidth*.5;
		output.innerHTML = '$' + translateValue(slider.value);
		output.style = 'left:'+xPosition+'px;';

		valueInput.value = slider.value*1000000;
	}

	slider.addEventListener('input', function(){
		setOutput();
	});

	sliderMin.textContent = translateValue(slider.getAttribute("min"));
	sliderMax.textContent = translateValue(slider.getAttribute("max"));

	setOutput();
}

function translateValue(value) {
	console.log(value);
	var amount = value*1000000;
	var readableAmount;

	if(amount >=1000000) {
		readableAmount = amount/1000000 + 'm';
	} else {
		readableAmount = amount/1000 +'k';
	}

	return readableAmount;
}