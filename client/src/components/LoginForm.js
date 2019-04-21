import React, {Component} from 'react';
import { Redirect } from 'react-router-dom'
import * as API from '../modules/api.js';

class LoginForm extends Component {
    constructor() {
        super();

        this.state = {
            login: "",
            password: ""
        };
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        API.login({
            login: this.state.login,
            password: this.state.password,
            })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                console.log(data);
                this.props.setLogin(data.login);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    render() {
        if (this.props.login) {
            return <Redirect to="/" push={true} />
        }

        return (
            <div style={containerStyle}>
                <form style={formStyle} onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Login"
                        id="login"
                        value={this.state.login}
                        onChange={this.handleChange}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    />

                    <input
                        type="submit"
                    />
                </form>
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

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: '2rem',
};

export default LoginForm;
