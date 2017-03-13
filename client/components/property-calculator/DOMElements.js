import 'awesomplete';
import * as slider from './sliderUtil';

;(function(){
	var buttons = document.querySelectorAll('.currency-button:not(.currency-input)');
	var currency = document.getElementById('currencyInput');
	var completeInput = document.querySelector('input.awesomplete');

	buttons.forEach(function(button){
		button.addEventListener('click', function(e){
			e.preventDefault();
			resetCurrencySelection(button);
			currency.value = button.dataset.currency;
			e.currentTarget.classList.add('selected');
			completeInput.value = null;
			slider.updateSlider(currency.value);
		});
	});

	completeInput.addEventListener('awesomplete-selectcomplete', function(e){
		resetCurrencySelection(null);
		e.currentTarget.classList.add('selected');
		currency.value = completeInput.value;
		slider.updateSlider(currency.value);
	});

	function resetCurrencySelection(target) {
		buttons.forEach(function(button){
			if(button !== target) button.classList.remove('selected');
		});
		completeInput.classList.remove('selected');
	}

	slider.initSlider();
	var trigger = document.querySelector('.currency-button[data-currency="GBP"]');
	trigger.click();
}());