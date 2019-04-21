import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import * as API from '../modules/api.js';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorized: true,
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log(nextProps.login);
        this.setState({
            authorized: !!nextProps.login,
        });
    }

    handleLogOut = () => {
        API.logOut(this.props.login)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                console.log(data);
                this.props.setLogin(null);
                this.setState({
                    authorized: false,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    render() {
        if (this.state.authorized) {
            return (
                <div style={{display: 'flex', width: "100%", justifyContent: 'center',}}>
                    <div style={headerStyle}>
                        {this.props.login}
                        <button style={buttonStyle} onClick={this.handleLogOut}>Log out</button>
                    </div>
                </div>
            );
        } else {
            return (
                <div style={{display: 'flex', width: "100%", justifyContent: 'center',}}>
                    <div style={headerStyle}>
                        <button style={buttonStyle}><Link style={linkStyle} to="/login">Log in</Link></button>
                    </div>
                </div>
            );
        }

    }
}

const headerStyle = {
    width: '100%',
    borderRadius: '4px',
    height: '4rem',
    backgroundColor: '#05386B',
    color: '#edf5e1',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'flex-end',
    fontSize: '2rem',
    alignItems: 'center'
};

const buttonStyle = {
    marginLeft: '1rem',
    marginRight: '1rem',
    fontSize: '1rem',
    borderRadius: '2px',
    cursor: 'pointer',
    backgroundColor: '#8ee4af',
    border: '#8ee4af',
    color: '#05386B',
};

const linkStyle = {
    textDecoration: 'none',
    color: '#05386B',
};

export default Header;
