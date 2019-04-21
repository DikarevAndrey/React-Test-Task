import React, {Component} from 'react';
import * as API from '../modules/api.js';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: '',
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        API.getText({login: nextProps.login, section: 'PUBLIC1'})
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                this.setState({
                    text: data.text,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    handleTextInput = (event) => {
        this.setState({
            text: event.target.value,
        });
    };

    handleSendCLick = () => {
        if (this.state.text) {
            API.sendText({
                text: this.state.text,
                author: this.props.login,
                section: 'PUBLIC1',
                created_at: Date.now(),
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                    this.setState({
                        text: data.text,
                    });
                })
                .catch((error) => {
                    console.log(error);
                })
        }

    };

    render() {
        return (
            <div style={containerStyle}>
                <input type="text" id="textField" placeholder="Text" value={this.state.text} onChange={this.handleTextInput}/>
                <button onClick={this.handleSendCLick}>Send</button>
            </div>
        );
    }
}

const containerStyle = {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
};

export default Home;
