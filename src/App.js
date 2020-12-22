import React, {Component} from "react";
import {BrowserRouter, Redirect, Route} from "react-router-dom";
import ContactForm from './components/ContactForm'
import Reply from './components/Reply'
import Login from './components/login'

import '@fortawesome/fontawesome-free/css/all.min.css';
import
    'bootstrap-css-only/css/bootstrap.min.css';
import
    'mdbreact/dist/css/mdb.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false
        }


    }

    onLoginSubmit = () => {
        this.setState({loggedIn: true})
    }
    handleClose = () => {
        this.setState({loggedIn: false})
    }


    render() {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <div>
                        <Route exact path="/">
                            {this.state.loggedIn ? <Redirect to="/contact"/> :
                                <Login handleClose={this.handleClose} onSubmit={this.onLoginSubmit}/>}
                        </Route>
                        <Route path="/contact" component={ContactForm}/>
                        <Route path="/reply" component={Reply}/>
                    </div>
                </BrowserRouter>
            </React.Fragment>
        );
    }
}

export default App;
