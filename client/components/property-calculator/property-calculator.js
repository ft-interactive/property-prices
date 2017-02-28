import * as d3 from 'd3';
import axios from 'axios';
import './DOMElements';

;(function(){
    const pd = getRecentPropertiesByLocation(window.propertyData);

    var userInput = document.getElementById('propertyCalculator');
    var outputContainer = document.querySelector('.output-flexWrapper');
    var outputAmount = document.querySelector('.output-container h1 .amount');

    userInput.addEventListener('submit', (e) => {
      e.preventDefault();

      clearOutput();
      var amount = document.getElementById('amountInput').value;
      var currency = document.getElementById('currencyInput').value;

      if(amount !== "" && currency !== "") {
        convertAmount(amount, currency);
        updateUserAmount(outputAmount);
      }
    });

    function convertAmount(value, currency) {
      for(var i in pd) {
        if(pd[i].currency !== currency) convertValue(currency, pd[i], value);
        else {
          pd[i].convertedValue = value;
          getArea(pd[i],value, currency)
        };
      }
    }

    function getArea(item, value, currency) {
        var toLocalCurrency = '(' + Math.round(item.convertedValue) + ' ' + item.currency +')';
        var userCurrency = value + ' ' + currency;
        var propertySize = Math.round(item.convertedValue/item.value) + ' sq m';

        //TODO: put all results in array to order by area size.

        var result = document.createElement("p");
        result.setAttribute("class", 'property-area');
        result.innerHTML = 'In ' +item.city + '<br>it buys you<br>' + '<span class="area">' + propertySize + '</span>';
        outputContainer.appendChild(result);
    }

    function convertValue(fromCurrency, item, value) {
      var endpoint = 'http://markets.ft.com/research/webservices/securities/v1/quotes?symbols='+ fromCurrency + item.currency+'&source=54321';

      axios.get(endpoint)
        .then(function (response) {
          item.convertedValue = response.data.data.items[0].quote.lastPrice*value;
          getArea(item, value, fromCurrency);
        })
        .catch(function (error) {
          console.log(error);
        });

    }

    function getRecentPropertiesByLocation(array) {
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

    function updateUserAmount(container) {
      var value = document.querySelector('.property-value-slider output').innerHTML;
      container.textContent = value;
    }

    function clearOutput() {
      var outputElem = document.querySelectorAll('.property-area');

      outputElem.forEach(function(elem){
        elem.remove();
      });
    }
}());