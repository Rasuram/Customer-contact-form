import React, {Component} from "react";
import {BrowserRouter, Route} from "react-router-dom";
import ContactForm from './components/ContactForm'
import Reply from './components/Reply'

import '@fortawesome/fontawesome-free/css/all.min.css'; import
    'bootstrap-css-only/css/bootstrap.min.css'; import
    'mdbreact/dist/css/mdb.css';

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <div>
                        <Route path="/contact" component={ContactForm}/>
                        <Route path="/reply" component={Reply}/>
                    </div>
                </BrowserRouter>
            </React.Fragment>
        );
    }
}

export default App;
