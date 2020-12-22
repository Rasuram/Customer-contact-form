import React, {Component} from 'react';

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
import axios from 'axios';
import PropTypes from "prop-types";
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#ff8f00" // This is an orange looking color
        },
        secondary: {
            main: "#ffcc80" //Another orange-ish color
        }
    },
});

const styles = {
    contactForm: {
        marginTop: 50,
        width: '60vh'
    }
};

export class ContactForm extends Component {
    state = {
        userName: '',
        email: '',
        message: '',
        subject: '',
        status: ''
    }

    // Handle submit button
    handleSubmit = async event => {
        event.preventDefault();
        this.setState({status: 'pending'});

        const {userName, email, message, subject} = this.state;
        axios.post(`https://kebh02i127.execute-api.us-east-2.amazonaws.com/user/sendmail`, {
            userName,
            email,
            message,
            subject
        }, {
            headers:
                {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-API-Token'
                }
        })
            .then(res => {
                this.setState({status: 'mail sent successfully!'});
                console.log(res);
                console.log(res.data);
            }).catch(error => {
            this.setState({status: 'failed to send email' + error});
        });


        // Reset from after submiting
        document.getElementById('contact-form').reset();
        this.setState({userName: "", email: "", message: ""});

    }

    // Handle fields change
    handleChange = input => event => {
        const {name, value} = event.target;
        this.setState({[name]: value});
    }

    render() {
        const {classes} = this.props;
        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline/>
                <div className={classes.container}>

                    <Grid container direction="column" justify="center" alignItems="center">
                        <Grid item>
                            <Typography variant="h4" align="center" component="h1" gutterBottom>
                                {'Customer Contact Form'.toUpperCase()}
                            </Typography>
                            <form
                                id="contact-form"
                                className={classes.contactForm}
                                onSubmit={this.handleSubmit}
                            >
                                <Grid item>
                                    <TextField
                                        fullWidth
                                        required
                                        id="name"
                                        label="Name"
                                        name="userName"
                                        className={classes.inputField}
                                        onChange={this.handleChange("userName")}
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        fullWidth
                                        required
                                        id="subject"
                                        label="Subject"
                                        name="subject"
                                        className={classes.inputField}
                                        onChange={this.handleChange("subject")}
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        fullWidth
                                        required
                                        id="email"
                                        label="Email"
                                        name="email"
                                        className={classes.inputField}
                                        onChange={this.handleChange("email")}
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        fullWidth
                                        required
                                        id="message"
                                        label="Message"
                                        name="message"
                                        className={classes.inputField}
                                        onChange={this.handleChange("message")}
                                        margin="normal"
                                        multiline
                                        rowsMax="4"
                                    />
                                </Grid>
                                <Grid container direction="row" spacing={2} style={{marginTop: 20}}>
                                    <Grid item>
                                        <Button
                                            className={classes.formButton}
                                            type="reset"
                                            variant="contained"
                                            color="default"
                                        >
                                            RESET
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            className={classes.formButton}
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                        >
                                            Submit
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <p>{this.state.status}</p>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>

                </div>
            </MuiThemeProvider>
        );
    }
}

ContactForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContactForm);
