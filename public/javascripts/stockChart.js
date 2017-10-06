/***************************************************************************************************
 * The StockChart class does the actual graphing of the stock prices. It is stateless
 ***************************************************************************************************/

import {Line} from 'react-chartjs-2';
import React from 'react';

export default class StockChart extends React.Component {
    constructor(props) {
        super(props);
    }

    getSmallestSet(prices, keys){
        let smallest = null;

        for(let i = 0; i < keys.length; i++) {
            let pricesArray = prices.get(keys[i]);
            let lth = pricesArray.prices.length;
            if (!smallest || lth < smallest)
                smallest = lth;
        }

        return smallest;
    }

    getLabels(prices, keys, selectedButton){
        let labels = [];
        let smallestSet = this.getSmallestSet(prices, keys);
        let start = 0, interval = 0;

        switch(selectedButton - 0) {
            case 0: // week
                interval = 1;

                if (smallestSet >= 7)
                    start = -6;
                break;
            case 1: //month
                interval = 3;

                if (smallestSet >= 30)
                    start = -30;
                break;
            case 2: //year
                interval = 30;

                if (smallestSet >= 360)
                    start = -360;
                break;
            case 3: //all
                interval = Math.floor(smallestSet / 12);
                start = smallestSet * -1 + 1;
                break;
        }

        let priceArray = prices.get(keys[0]).prices;

        for(let i = start; i <= 0; i += interval)
            labels.push(priceArray[i + priceArray.length - 1].date);

        return labels;
    }

    getDataSetsArray(labels, keys, stocks){
        let dataSetsArray = [];
        let labelsMap = new Map();

        for(let i = 0; i < labels.length; i++){
            labelsMap.set(labels[i], true);
        }


        for(let i = 0; i < keys.length; i++) {
            let pricesArray = stocks.get(keys[i]).prices;
            let color = stocks.get(keys[i]).color;
            let priceData = [];

            for (let j = 0; j < pricesArray.length; j++) {
                if (labelsMap.has(pricesArray[j].date))
                    priceData.push(pricesArray[j].close);
            }

            let dataSet = {
                label: keys[i],
                backgroundColor: color,
                borderColor: color,
                fill: false,
                data: priceData
            }

            dataSetsArray.push(dataSet);
        }

        return dataSetsArray;

    }

    render() {
        if (this.props.stocks.size == 0) return null;

        let keys = [ ...this.props.stocks.keys() ].sort();
        let stock = this.props.stocks.get(keys[0]);
        let prices = stock.prices;
        let priceData = [];
        let labels = this.getLabels(this.props.stocks, keys, this.props.selectedButton);
        let dataSetsArray = this.getDataSetsArray(labels, keys, this.props.stocks);

        let data =  {
            labels: labels,
            datasets: dataSetsArray
        };

        let options = {
            title: {
                display: true,
                text: 'Stock Closing Prices (in dollars)'
            }
        };

        return(
            <div className="chart-container">
                <Line data={data} options={options} />
            </div>
        )
    }


}

