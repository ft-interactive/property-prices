import axios from 'axios';
import './DOMElements';
import * as projection from './projection';

;(function(){
    const pd = getRecentPropertiesByLocation(window.propertyData);
    var callbackCount = 0;
    var outputItems = [];

    var userInput = document.getElementById('propertyCalculator');
    var outputContainer = document.querySelector('.output-flexWrapper');
    var outputAmount = document.querySelector('.output-container h1 .amount');

    userInput.addEventListener('submit', (e) => {
      e.preventDefault();

      var amount = document.getElementById('amountInput').value;
      var currency = document.getElementById('currencyInput').value;

      if(amount !== "" && currency !== "") {
        convertAmount(amount, currency);
        updateUserAmount(outputAmount);
      }
    });

    function convertAmount(value, currency) {
      callbackCount = 0;
      outputItems = [];
      for(var i in pd) {
        if(pd[i].currency !== currency) convertValue(currency, pd[i], value, pd.length);
        else {
          pd[i].convertedValue = value;
          pd[i].area = getArea(pd[i]);
          outputItems.push(pd[i]);
          ++callbackCount;

          if(callbackCount === pd.length) {
            prepareOutput();
          }
        };
      }
    }

    function prepareOutput() {
      var outputElem = document.querySelectorAll('.property-area');

      outputElem.forEach(function(elem){
        elem.remove();
      });

      outputItems.sort(function(a,b){
        return a.area - b.area;
      });

      for(var i in outputItems) {
        var propertySize =  outputItems[i].area + ' sq m';


        var result = document.createElement("p");
        result.setAttribute("class", 'property-area');
        result.innerHTML = outputItems[i].city + '<br>' + '<span class="area">' + propertySize + '</span>';
        outputContainer.appendChild(result);

        projection.getProjection(outputItems[i].area, outputItems[outputItems.length - 1].area, result);
      }
    }

    function convertValue(fromCurrency, item, value, cbCount) {
      var endpoint = 'http://markets.ft.com/research/webservices/securities/v1/quotes?symbols='+ fromCurrency + item.currency+'&source=6ab4f82a42045502';

      axios.get(endpoint)
        .then(function (response) {
          if(response.data.data.items[0].quote.lastPrice) {
            item.convertedValue = response.data.data.items[0].quote.lastPrice*value;
            item.area = getArea(item);
            
            outputItems.push(item);
            ++callbackCount;
          } else {
            showError();
          }

          if(cbCount === callbackCount) {
            prepareOutput();
          }
        })
        .catch(function (error) {
          console.log(error);
        });

    }

    function getArea(item) {
      return Math.round(item.convertedValue/item.value);
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

    function showError() {
      var outputElem = document.querySelectorAll('.property-area');

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
}());