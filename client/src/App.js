import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as API from './modules/api.js';
import './App.css';

import LoginForm from './components/LoginForm.js';
import Header from './components/Header.js';
import Home from './components/Home.js';

class App extends Component {
    constructor() {
        super();

        this.state = {
            login: null,
        }
    }

    componentDidMount() {
        API.getSessionInfo()
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                this.setState( {
                    login: data.login,
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState( {
                    login: null,
                });
            });
    }

    setLogin = (login) => {
        this.setState({
            login
        });
    };

    render() {
        return (
            <Router>
                <div>
                    <Header login={this.state.login} setLogin={this.setLogin}></Header>
                    <Route
                        path="/login"
                        render={() => <LoginForm setLogin={this.setLogin} login={this.state.login}></LoginForm>}
                    />
                    <Route
                        path="/" exact
                        render={() => <Home login={this.state.login}></Home>}
                    />
                </div>
            </Router>
        );
    }
}

const appStyle = {
    backgroundColor: '#edf5e1',
};

export default App;
