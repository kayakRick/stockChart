/*******************************************************************************************************
 * GoForm renders that form in wich the user selects the stocks to graph. It is stateless
 *******************************************************************************************************/

import React from 'react';

export default class GoForm extends React.Component {
    constructor(props) {
        super(props);
    }
    render(){
        let disabled = this.props.value.length >= 3 && this.props.value.length <= 5 ? "" : "disabled";
        return(
            <div className=" go-container">
            <form className="form-inline" onSubmit={this.props.onSubmit}>
                <div className="form-group">
                    <input id="in" type="text" className="form-control" placeholder="Enter a stock symbol"
                           maxLength="5" size="20"
                           onChange={this.props.onChange} value={this.props.value}></input>
                </div>
                <button id="btn" type="button" className="btn btn-default btn-small" disabled={disabled}
                    onClick={this.props.onClick}>Go</button>
            </form>
        </div>
        );
    }
}
