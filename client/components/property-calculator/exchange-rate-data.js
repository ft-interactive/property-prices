import * as d3 from 'd3';

export function exchangeRate(){
    const rateData = {
        'USD':1,  //the default value is always dollars so 1:1 exchange rate
    };

    function rate(currencysymbol, error, callback){
        if(!callback) callback = (d)=>(console.log(d));
        if(!error) error = (e)=>(console.log(e));
        if(rateData[currencysymbol]) callback( rateData[currencysymbol] );
        
        if(!rateData[currencysymbol]){   //go get that exchange rate if we don't already have it
            d3.json(marketDataURL(currencysymbol), function(data){
                rateData[currencysymbol] = data.data.items[0].quote.lastPrice;
                callback( rateData[currencysymbol] );
            });
        }
    }

    function marketDataURL(currency){
       return `http://markets.ft.com/research/webservices/securities/v1/quotes?symbols=usd${currency.toLowerCase()}&source=5d32d7c412`
    }

    return rate;
}