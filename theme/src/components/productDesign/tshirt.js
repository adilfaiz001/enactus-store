import React, { Component } from 'react';

class EnactussLightbox extends Component {
    constructor(){
        super();
        this.state = {
            state: false,
            cancel: false
        };
    }

    componentWillMount(){
        this.setState({
            state:this.props.state,
            cancel:this.props.cancel
        });
        console.log(this.props);
    }

    render()
    {
        return(
            <div>
                <h1>Get Form Here</h1>
            </div>
        );
    }
}

export default TshirtLightbox;
