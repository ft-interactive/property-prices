import * as d3 from 'd3';

export function exchangeRate(){
    const rateData = {
        'USD':1,  //the default value is always dollars so 1:1 exchange rate
    };

    function rate(currencysymbol, error, callback){
        if(!callback) callback = (d)=>(console.log(d));
        if(!error) error = (e)=>(console.log(e));
        if(rateData[currencysymbol]){
          callback( rateData[currencysymbol] );
          return true;
        }else{
          d3.json(marketDataURL(currencysymbol), function(data){
              rateData[currencysymbol] = data.data.items[0].quote.lastPrice;
              callback( rateData[currencysymbol] );
          });
          return false;
        }
    }

    function marketDataURL(currency){
       return `https://markets.ft.com/research/webservices/securities/v1/quotes?symbols=usd${currency.toLowerCase()}&source=5d32d7c412`
    }

    return rate;
}
