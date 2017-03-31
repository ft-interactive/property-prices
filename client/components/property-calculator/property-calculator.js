import axios from 'axios';
import * as d3 from 'd3';
import * as projection from './projection';
import 'awesomplete';
import * as slider from './sliderUtil';
import {getSymbolFromCurrency} from 'currency-symbol-map';
import * as market from './exchange-rate-data';

const pd = getRecentPropertiesByLocation(window.propertyData);
const rates = market.exchangeRate();

document.getElementById('propertyCalculator').addEventListener('submit', (e) => {
  e.preventDefault();
  var amount = document.getElementById('amountInput').value;
  var currency = document.getElementById('currencyInput').value;

  if(amount !== '' && currency !== '') {
    rates(currency, null, function(r){
      update(amount, r, pd, currency);
    });
  }
});

function update(amount, exchangeRate, data, currency){
  function getArea(d){
      return Math.round(dollarAmount/d.value);
  }
  const dollarAmount = amount / exchangeRate;
  const squareDrawer = projection.square()
    .areaAccessor(getArea);

//add elements if they don't exist
  d3.select('.output-flexWrapper')
    .selectAll('p.property-area')
    .data(data.sort(function(a,b){
        return (b.value - a.value);
      }), function(d){ return d.city })
      .enter()
    .call(function(wrapper){
      wrapper.append('p')
        .attr('class', 'property-area')
        .call(function(parent){
          parent.append('span')
            .attr('class','city-name')
            .text(function(d){
              return d.city;
            });

        parent.append('span')
          .attr('class','area')
          .html(function(d){ return ' ' + getArea(d) + ' sq m' });

        parent.append('svg')
          .attr('class','property')

      });
    });

  //update elements
  d3.selectAll('.property-area svg.property')
    .call(squareDrawer);

 d3.selectAll('.property-area span.area')
    .html(function(d){ return ' ' + getArea(d) + ' sq m' });

  d3.select('h1 span.amount').text(getSymbolFromCurrency(currency) +  slider.translateValue( amount ));

}

//return a unique list of cities (favouring the most recent data point)
function getRecentPropertiesByLocation(array) {
  console.log(array);
  var duplicateArray = sortPropertiesByLocationAndDate(array.slice());

  for(var i = duplicateArray.length - 1; i > 0; --i) {
    if(duplicateArray[i - 1].city === duplicateArray[i].city) {
      duplicateArray.splice(i, 1);
    }
  }

  return duplicateArray;
}

function sortPropertiesByLocationAndDate(array) {
  array.sort(function(a,b){
    if(a.city === b.city) {
      return new Date(b.date) - new Date(a.date);
    }
    else {
      var nameA=a.city.toLowerCase(), nameB=b.city.toLowerCase()
      if (nameA < nameB)
        return -1
      if (nameA > nameB)
        return 1
      return 0;
    }
  });

  return array;
}

function UI(){
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

	slider.initSlider(rates);
	var trigger = document.querySelector('.currency-button[data-currency="GBP"]');
	trigger.click();
}
UI();



//TODO, hook this up again
function showError() {
  const outputElem = document.querySelectorAll('.property-area');
  const outputContainer = document.querySelector('.output-flexWrapper');

  outputElem.forEach(function(elem){
    elem.remove();
  });

  var hasError = outputContainer.querySelector('.error-message');

  if(hasError === null) {
    var result = document.createElement("p");
    result.setAttribute('class', 'error-message');
    result.innerHTML = 'Sorry, there is no data for this currency';
    outputContainer.appendChild(result);
  }
}
