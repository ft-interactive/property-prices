import axios from 'axios';
import './DOMElements';
import * as d3 from 'd3'; 
import * as projection from './projection';

;(function(){
    const pd = getRecentPropertiesByLocation(window.propertyData);
    
    var callbackCount = 0; //TODO get rid
    var outputItems = []; 

    var userInput = document.getElementById('propertyCalculator');
    var outputContainer = document.querySelector('.output-flexWrapper');
    var outputAmount = document.querySelector('.output-container h1 .amount');

    var exchangeRates = {
      'USD':1,  //the default value is always dollars so 1:1 exchange rate
    };

    userInput.addEventListener('submit', (e) => {
      e.preventDefault();
      var amount = document.getElementById('amountInput').value;
      var currency = document.getElementById('currencyInput').value;

      if(amount !== '' && currency !== '') {
        if(!exchangeRates[currency]){
          //go get that exchange rate
          d3.json(marketDataURL(currency),function(data){
            exchangeRates[currency] = data.data.items[0].quote.lastPrice;
            update(amount, exchangeRates[currency], pd);
          });
        }else{
          //otherwise go ahead
          update(amount, exchangeRates[currency], pd)
        }
      }
    });

    function update(amount, exchangeRate, data){

      var dollarAmount = amount / exchangeRate;
      var squareDrawer = projection.square()
        .areaAccessor(function(d){
          return Math.round(dollarAmount/d.value);
        });

//add elements if they don't exist
      d3.select('.output-flexWrapper')
        .selectAll('p.property-area')
        .data(data, function(d){ return d.city })
          .enter()
        .append('p')
          .attr('class', 'property-area')
        .call(function(parent){
          parent.append('span')
            .attr('class','city-name')
            .text(function(d){
              return d.city;
            });
          parent.append('span')
            .attr('class','area')
            .html(function(d){ return ' ' + Math.round(dollarAmount/d.value) + ' m<sup>2</sup>' });
          
          parent.append('svg')
            .attr('class','property');
        });
//update elements
      d3.selectAll('.property-area svg.property')
        .call(squareDrawer);
        


    }

    function marketDataURL(currency){
      return `http://markets.ft.com/research/webservices/securities/v1/quotes?symbols=usd${currency.toLowerCase()}&source=5d32d7c412`
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