;(function(){
	var buttons = document.querySelectorAll('.currency-button');
	var currency = document.getElementById('currencyInput');

	buttons.forEach(function(button){
		button.addEventListener('click', function(e){
			e.preventDefault();
			resetCurrencySelection(button);
			currency.value = button.dataset.currency;
			e.currentTarget.classList.add('selected');
		});
	});

	function resetCurrencySelection(target) {
		buttons.forEach(function(button){
			if(button !== target) button.classList.remove('selected');
		});
	}
}());