import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";


class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            isAuthenticating: true,
            schemaName: "",
            login: "",
            password: "",
            dbType: ""
        };
    }

    userHasAuthenticated = authenticated => {
        this.setState({ isAuthenticated: authenticated });
    }

    settingSchemaName = setSchemaName => {
        this.setState({ schemaName: setSchemaName });
    }
    settingLogin = setLogin => {
        this.setState({ login: setLogin });
    }

    settingPassword = setPassword => {
        this.setState({ password: setPassword });
    }

    settingDbType = setDbType => {
        this.setState({ dbType: setDbType });
    }

    handleLogout = event => {
        this.userHasAuthenticated(false);
    }

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            schemaName: this.state.schemaName,
            login: this.state.login,
            password: this.state.password,
            dbType: this.state.dbType,
            userHasAuthenticated: this.userHasAuthenticated,
            settingSchemaName: this.settingSchemaName,
            settingLogin: this.settingLogin,
            settingPassword: this.settingPassword,
            settingDbType: this.settingDbType

        };

        return (
            <div className="App container">
                <Navbar fluid collapseOnSelect className="MainNavbar">
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/">Home page</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            {this.state.isAuthenticated
                                ? <Fragment>
                                    <LinkContainer to="/tree">
                                        <NavItem>Tree</NavItem>
                                    </LinkContainer>
                                        <NavItem onClick={this.handleLogout}>Logout</NavItem>
                                    </Fragment>
                                : <Fragment>
                                    <LinkContainer to="/signup">
                                        <NavItem>Signup</NavItem>
                                    </LinkContainer>
                                    <LinkContainer to="/login">
                                        <NavItem>Login</NavItem>
                                    </LinkContainer>
                                </Fragment>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Routes childProps={childProps} />
            </div>
        );
    }
}

export default App;