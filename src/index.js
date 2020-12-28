import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Amplify from "aws-amplify";
import App from './App';
import * as serviceWorker from './serviceWorker';
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);
/*Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: config.cognito.REGION,
        identityPoolId: config.cognito.AWS_IDENTITY_POOL_ID,
        userPoolId: config.cognito.USER_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    }
});*/


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
