import React, {useEffect, useRef, useState} from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import {useHistory} from "react-router-dom";
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import config from '../config/secret.json';
import Amplify, {Auth} from "aws-amplify";
import {MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter} from 'mdbreact';


import CardActions from '@material-ui/core/CardActions';
import TextField from "@material-ui/core/TextField";
import '../App.css';
import {createStyles} from "@material-ui/core";
import FacebookLogin from "react-facebook-login";
import {GoogleLogin} from "react-google-login";
import {CognitoUserPool} from "amazon-cognito-identity-js";

const useStyles = makeStyles((theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            width: 400,
            margin: `${theme.spacing(0)} auto`
        },
        loginBtn: {
            marginTop: theme.spacing(2),
            flexGrow: 1
        },
        header: {
            textAlign: 'center',
            background: '#212121',
            color: '#fff'
        },
        card: {
            marginTop: theme.spacing(10)
        }

    }),
);
const Login = (props) => {
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [helperText, setHelperText] = useState('');
    const [error, setError] = useState(false);
    const history = useHistory();
    const {handleClose} = props;
    const {onSubmit} = props;

    useEffect(() => {
        if (username.trim() && password.trim()) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [username, password]);

    const handleLogin = async (props) => {
        // AWS Cognito integration here
        try {
            const user = await Auth.signIn(username, password);
            console.log(user);
            setError(false);
            history.push("/");
            onSubmit();
            setHelperText('Login Successfully');
        } catch (error) {
            let err = null;
            !error.message ? err = {"message": error} : err = error;
            setError(true);
            setHelperText(error.message)
            console.log(error);
        }
    };


    const logout = () => {
        setAuthenticated(false);
        setToken('');
        setUser(null);
    };

    const onFailure = (error) => {
        // alert(error);
    };

    const validateUser = (props) => {
        const {loginSuccess} = props;
        //reverse-proxy to supress cors
        const url = 'http://localhost:3000/login';
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                userName: username,
                passWord: password
            }),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then((response) => {
            if (response.status === 200) {
                loginSuccess(true);
                handleClose()
            } else {
                setError(true);
                setHelperText('Incorrect username or password')
            }
        })
    }
    const handleKeyPress = (e) => {
        if (e.keyCode === 13 || e.which === 13) {
            isButtonDisabled || handleLogin();
        }
    };

    const facebookResponse = (response) => {
        history.push("/");
        onSubmit();
        const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type: 'application/json'});
        const options = {
            method: 'POST',
            body: tokenBlob,
            mode: 'cors',
            cache: 'default'
        };
        fetch('http://localhost:4000/api/v1/auth/facebook', options).then(r => {
            const token = r.headers.get('x-auth-token');
            r.json().then(user => {
                if (token) {
                    setAuthenticated(true);
                    setToken(token);
                    setUser(user);
                }
            });
        })
    };

    const googleResponse = (response) => {
        history.push("/");
        onSubmit();
        const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type: 'application/json'});
        const options = {
            method: 'POST',
            body: tokenBlob,
            mode: 'cors',
            cache: 'default'
        };
        fetch('http://localhost:4000/api/v1/auth/google', options).then(r => {
            const token = r.headers.get('x-auth-token');
            r.json().then(user => {
                if (token) {
                    setAuthenticated(true);
                    setToken(token);
                    setUser(user);
                }
            });
        })
    };


    return (
        <React.Fragment>
            <MDBContainer>
                <MDBRow>
                    <MDBCol md="6">
                        <MDBCard>
                            <MDBCardBody className="mx-4">
                                <div className="text-center">
                                    <h3 className="dark-grey-text mb-5">
                                        <strong>Sign in</strong>
                                    </h3>
                                </div>
                                <CardContent>
                                    <div>
                                        <TextField
                                            error={error}
                                            fullWidth
                                            id="username"
                                            type="email"
                                            label="Username"
                                            placeholder="Username"
                                            margin="normal"
                                            onChange={(e) => setUsername(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e)}
                                        />
                                        <TextField
                                            error={error}
                                            fullWidth
                                            id="password"
                                            type="password"
                                            label="Password"
                                            placeholder="Password"
                                            margin="normal"
                                            helperText={helperText}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e)}
                                        />
                                    </div>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        variant="contained"
                                        size="medium"
                                        color="secondary"
                                        className={classes.loginBtn}
                                        onClick={() => handleClose()}>
                                        cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="medium"
                                        color="primary"
                                        className={classes.loginBtn}
                                        onClick={() => handleLogin(props)}
                                        disabled={isButtonDisabled}>
                                        Login
                                    </Button>

                                </CardActions>
                                <p className="font-small blue-text d-flex justify-content-end pb-3">
                                    Forgot
                                    <a href="#!" className="blue-text ml-1">

                                        Password?
                                    </a>
                                </p>
                                <p className="font-small dark-grey-text text-right d-flex justify-content-center mb-3 pt-2">

                                    or Sign in with:
                                </p>

                                <div className="row my-3 d-flex justify-content-center">
                                    <FacebookLogin
                                        appId={config.FACEBOOK_APP_ID}
                                        autoLoad={false}
                                        fields="name,email,picture"
                                        callback={facebookResponse}>
                                        <MDBBtn
                                            type="button"
                                            color="white"
                                            rounded
                                            className="mr-md-3 z-depth-1a"
                                        >
                                            <MDBIcon fab icon="facebook-f" className="blue-text text-center"/>
                                        </MDBBtn>
                                    </FacebookLogin>

                                    <MDBBtn
                                        type="button"
                                        color="white"
                                        rounded
                                        className="mr-md-3 z-depth-1a"
                                    >
                                        <MDBIcon fab icon="twitter" className="blue-text"/>
                                    </MDBBtn>
                                    <GoogleLogin
                                        clientId={config.GOOGLE_CLIENT_ID}
                                        buttonText="Login"
                                        onSuccess={googleResponse}
                                        onFailure={onFailure}
                                    >
                                        <MDBIcon fab icon="google-plus-g" className="blue-text"/>
                                    </GoogleLogin>

                                </div>
                            </MDBCardBody>
                            <MDBModalFooter className="mx-5 pt-3 mb-1">
                                <p className="font-small grey-text d-flex justify-content-end">
                                    Not a member?
                                    <a href="/register" className="blue-text ml-1">
                                        Sign Up
                                    </a>
                                </p>
                            </MDBModalFooter>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </React.Fragment>
    );
}

export default Login;
