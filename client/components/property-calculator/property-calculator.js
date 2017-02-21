import * as d3 from 'd3';
import axios from 'axios';

;(function(){
    const pd = getRecentPropertiesByLocation(window.propertyData);

    var userInput = document.getElementById('propertyCalculator');
    var output = document.getElementById('output');
    // var svg = d3.select("#testSVG").append('svg');

    userInput.addEventListener('submit', (e) => {
      e.preventDefault();
      output.innerHTML = '';
      var amount = document.getElementById('amount').value;
      var currency = 'GBP';

      if(amount !== "" && currency !== "") convertAmount(amount, currency);
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
        var toLocalCurrency = '(' + item.convertedValue + item.currency +')';
        var userCurrency = value + ' ' + currency;
        var propertySize = Math.floor(100*item.convertedValue/item.value)/100 + ' sqmt';

        var result = document.createElement("p");
        result.textContent = userCurrency +' ' + toLocalCurrency + ' buys ' + propertySize + ' in ' + item.city;
        output.appendChild(result);
    }

    function convertValue(fromCurrency, item, value) {
      var endpoint = 'http://markets.ft.com/research/webservices/securities/v1/quotes?symbols='+ fromCurrency + item.currency+'&source=54321';

      axios.get(endpoint)
        .then(function (response) {
          item.convertedValue = response.data.data.items[0].quote.closePrice*value;
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
}());