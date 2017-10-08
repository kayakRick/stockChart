/*******************************************************************************************************
 * index.js is the main page for the app. It contains the App class which is the main logic. App is
 * stateful and it controlls all the other classes in the app
 ********************************************************************************************************/
"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import ButtonGroup from './buttonGroup';
import GoForm from "./goForm";
import getBaseUrl from "./getBaseUrl";
import StockChart from "./stockChart";
import DeleteButtons from "./deleteButtons";


class App extends React.Component {
    constructor(props) {
        super(props);

        this.onButtonGroupClick = this.onButtonGroupClick.bind(this);
        this.onStockSymbolChange = this.onStockSymbolChange.bind(this);
        this.onGoFormClick = this.onGoFormClick.bind(this);
        this.onGoFormSubmit = this.onGoFormSubmit.bind(this);
        this.alertContents = this.alertContents.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.onWsMessage = this.onWsMessage.bind(this);

        this.state = {
            selectedButton: 3,
            stockSymbol: "",
            stocks: new Map()
        };

        this.stockHistoryUrl = getBaseUrl() + "stock-history/";
        this.httpRequest = null;

        if(window.location.port != "")
            this.ws = new WebSocket("ws://" + window.location.hostname + ":" + window.location.port);
        else
            this.ws = new WebSocket("ws://" + window.location.hostname);

        this.ws.onmessage = this.onWsMessage;
    }

    onButtonGroupClick(e){
        this.setState({selectedButton: e.target.value});
    }

    onDeleteClick(e){
        let stocks = this.state.stocks;
        stocks.delete(e.target.value);
        this.setState({stocks: stocks});
        this.ws.send(JSON.stringify({op: "delete", id: this.state.id, stock: e.target.value}));
    }

    onStockSymbolChange(e){
        this.setState({stockSymbol: e.target.value.trim().toUpperCase()});
    }

    onGoFormSubmit(e){
        e.preventDefault();

        if(this.state.stockSymbol.length >= 3 && this.state.stockSymbol.length <= 5)
            this.onGoFormClick();
    }

    onGoFormClick(){
        if(this.state.stocks.has(this.state.stockSymbol)) {
            bootbox.alert(this.state.stockSymbol + " has already been added");
            return;
        }

        document.getElementById("in").style.cursor = "wait";
        document.getElementById("btn").style.cursor = "wait";
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.alertContents;
        this.httpRequest.open("GET", this.stockHistoryUrl + this.state.stockSymbol);
        this.httpRequest.send();
    }

    alertContents() {
        try {
            if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                document.getElementById("in").style.cursor = "default";
                document.getElementById("btn").style.cursor = "default";
                if (this.httpRequest.status === 200) {
                    let res = JSON.parse(this.httpRequest.responseText);
                    let stocksMap = this.state.stocks;
                    stocksMap.set(this.state.stockSymbol, res);
                    this.ws.send(JSON.stringify({op: "add", id: this.state.id, stock: this.state.stockSymbol}));
                    this.setState({stocks: stocksMap, stockSymbol: ""});
                } else {
                    bootbox.alert(this.state.stockSymbol + " not found");
                }
            }
        }
        catch (e) {
            console.log("Caught Exception: " + e.message);
            bootbox.alert("Caught Exception: " + e.message);
        }
    }

    onWsMessage(e){
        let data = JSON.parse(e.data);
        let stocks = this.state.stocks;

        switch(data.op){
            case "ident":
                this.setState({id: data.id})
                break;
            case "delete":
                stocks.delete(data.stock);
                this.setState({stocks: stocks});
                break;
            case "add":
                stocks.set(data.stock, data.payLoad);
                this.setState({stocks: stocks});
                break;
            case "addAll":
                let stocksMap = new Map();

                for(let i = 0; i < data.payLoad.length; i++){
                    stocksMap.set(data.payLoad[i].symbol, data.payLoad[i].value);
                }

                this.setState({stocks: stocksMap});
                break;


        }
    }

    render(){
        return (
            <div>
                <div className="container-fluid app-container default-primary-color">
                    <h1 className=" text-center text-primary-color">Stock Chart</h1>
                    <ButtonGroup selected={this.state.selectedButton} onClick={this.onButtonGroupClick}/>
                    <GoForm onChange={this.onStockSymbolChange} value={this.state.stockSymbol}
                            onClick={this.onGoFormClick}
                            onSubmit={this.onGoFormSubmit}/>
                    <DeleteButtons stocks={this.state.stocks} onClick={this.onDeleteClick}/>
                </div>
                <StockChart stocks={this.state.stocks}
                            selectedButton={this.state.selectedButton}/>
            </div>
        );
    }
}

ReactDOM.render(
    <div>
        <App/>
    </div>,
    document.querySelector("#app")
);