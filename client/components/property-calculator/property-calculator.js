import * as d3 from 'd3';

;(function(){
    console.log(window.propertyData);
    const pd = window.propertyData;

    var userInput = document.getElementById('propertyCalculator');
    var svg = d3.select("#testSVG").append('svg');

    userInput.addEventListener('submit', (e) => {
      e.preventDefault();
      var amount = document.getElementById('amount').value;

      if(amount !== "") getArea(amount);
    });

    function getArea(value) {
      console.log(value);

      for(var i in pd) {
        console.log(Math.floor(parseInt(value)/parseInt(pd[i].value)) + 'sqmt in ' + pd[i].city);
      }
    }
}());