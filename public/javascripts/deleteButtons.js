/*******************************************************************************************************
 * DeleteButtons renders the group of buttons that delete individual stocks from the graph. It is
 * stateless
 *******************************************************************************************************/

import React from 'react';

export default class DeleteButtons extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let keys = [ ...this.props.stocks.keys() ].sort();

        if(keys.length == 0)
            return null;

        let buttons = [];
        let width = keys.length * 70 + "px";

        let divStyle = {width: width};

        for(let i = 0; i < keys.length; i++){
            buttons.push(<button key={i} className="btn btn-danger" value={keys[i]} onClick={this.props.onClick}>
                {keys[i]} <span className="glyphicon glyphicon-trash" aria-hidden="true"></span></button>)
        }

        return (
            <div className="delete-container" style={divStyle}>
                <div className="btn-group btn-group-sm" role="group" aria-label="...">
                    {buttons}
                </div>
            </div>
        );
    }
}