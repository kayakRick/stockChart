/********************************************************************************************************
 * This file implements a restful service that will supply the price history for the specified
 * stock. It also randomly selects a color foe the graph of the stock
 ********************************************************************************************************/

var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/:symbol', function (req, res, next) {
    if (!global.hasOwnProperty("stocks"))
        global.stocks = new Map();

    let symbol = req.params.symbol.toUpperCase();

    if (global.stocks.has(symbol))
        res.send(global.stocks.get(symbol));
    else {
        request("https://www.alphavantage.co/query?" +
            "function=TIME_SERIES_DAILY_ADJUSTED&symbol=" + req.params.symbol +
            "&outputsize=full&apikey=" + process.env.ALPHA_ADVANTAGE_KEY, (error, response, body) => {

            resp = JSON.parse(body);

            if (response.statusCode != 200 || resp.hasOwnProperty("Error Message")) {
                console.log('statusCode:', response && response.statusCode);
                console.log(body);
                res.status(400).send(resp);
            } else {
                resp.color = rgb(rand(0, 255), rand(0, 255), rand(0, 255));
                addToStocks(symbol, resp);
                res.send(global.stocks.get(symbol));
            }

        });
    }
});

function addToStocks(symbol, resp) {
    let prices = [];
    let dates = Object.getOwnPropertyNames(resp["Time Series (Daily)"]).sort();

    for(let i = 0; i < dates.length; i ++){
        prices.push({date: dates[i],
            close: resp["Time Series (Daily)"][dates[i]]["5. adjusted close"]});
    }

    global.stocks.set(symbol, {color: resp.color, prices: prices});
}


function rgb(r, g, b){
    return "rgb("+r+","+g+","+b+")";
}


function rand(min, max){
    max++;
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}



module.exports = router;
