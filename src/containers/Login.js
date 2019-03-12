import React, {Component} from "react";
import {Button, FormGroup, FormControl} from "react-bootstrap";
import {ControlLabel} from "react-bootstrap";
import "./Login.css";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: "",
            password: "",
            dbName: "",
            dbType: "",
            credentialsAreCorrect: ""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    validateForm() {
        return this.state.login.length > 0 && this.state.password.length > 0
            && this.state.dbName.length > 0 && this.state.dbType.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                login: this.state.login,
                password: this.state.password,
                dbName: this.state.dbName,
                dbType: this.state.dbType
            })
        }).then(response => response.text())
            .then(response => this.checkCredentials(response))
            .catch(function (error) {
                alert.log('Request failed', error);
            });
    }


    checkCredentials = (check) => {
        if (check === "true") {
            this.setState({credentialsAreCorrect: check});
            this.props.userHasAuthenticated(check);
            this.props.settingSchemaName(this.state.dbName);
            this.props.settingLogin(this.state.login);
            this.props.settingPassword(this.state.password);
            this.props.settingDbType(this.state.dbType);
        } else {
            alert("Credentials are wrong");
        }
    }


    render() {
        if (this.state.credentialsAreCorrect) {
        return (<div className="LoginSucceeded">
            <h3>You are logged in!</h3>
        </div>);
        } else {
            return (
                <div className="Login">
                    <form onSubmit={this.handleSubmit}>
                        <FormGroup controlId="login" bssize="large">
                            <ControlLabel>Login</ControlLabel>
                            <FormControl
                                autoFocus
                                type="login"
                                value={this.state.login}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup controlId="password" bssize="large">
                            <ControlLabel>Password</ControlLabel>
                            <FormControl
                                value={this.state.password}
                                onChange={this.handleChange}
                                type="password"
                            />
                        </FormGroup>
                        <FormGroup controlId="dbName" bssize="large">
                            <ControlLabel>DB name</ControlLabel>
                            <FormControl
                                value={this.state.dbName}
                                onChange={this.handleChange}
                                type="login"
                            />
                        </FormGroup>
                        <FormGroup controlId="dbType" bssize="large">
                            <ControlLabel>DB type</ControlLabel>
                            <FormControl
                                value={this.state.dbType}
                                onChange={this.handleChange}
                                type="login"
                            />
                        </FormGroup>
                        <Button
                            block
                            bssize="large"
                            disabled={!this.validateForm()}
                            type="submit"
                        >
                            Login
                        </Button>
                    </form>
                </div>
            );
        }
    }
}