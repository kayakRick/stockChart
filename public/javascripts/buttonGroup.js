/********************************************************************************************************
 * ButtonGroup encapsulates the grouo of buttons that control the time span of the graph. It is
 * stateless
 ********************************************************************************************************/

import React from 'react';

export default class ButtonGroup extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let selected = ["btn btn-default", "btn btn-default", "btn btn-default", "btn btn-default"];
        selected[this.props.selected] = "btn btn-primary";

        return (
            <div className="btn-group btn-group-sm" role="group" aria-label="...">
                <button type="button" className={selected[0]} value={0} onClick={this.props.onClick}>
                    Week</button>
                <button type="button" className={selected[1]} value={1} onClick={this.props.onClick}>
                    Month</button>
                <button type="button" className={selected[2]} value={2} onClick={this.props.onClick}>
                    Year</button>
                <button type="button" className={selected[3]} value={3} onClick={this.props.onClick}>
                    All</button>
            </div>
        );
    }
}