import * as d3 from 'd3';

;(function(){
    const pd = getRecentPropertiesByLocation(window.propertyData);

    var userInput = document.getElementById('propertyCalculator');
    var output = document.getElementById('output');
    // var svg = d3.select("#testSVG").append('svg');

    userInput.addEventListener('submit', (e) => {
      e.preventDefault();
      output.innerHTML = '';
      var amount = document.getElementById('amount').value;

      if(amount !== "") getArea(amount);
    });

    function getArea(value) {
      for(var i in pd) {
        var result = document.createElement("p");
        result.textContent = value + ' ' + pd[i].currency + ' buys ' + Math.floor(100*parseInt(value)/parseInt(pd[i].value))/100 + ' sqmt in ' + pd[i].city;
        output.appendChild(result);
      }
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