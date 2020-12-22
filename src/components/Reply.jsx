import React from "react";
import {MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBInput, MDBBox} from 'mdbreact';
import queryString from 'query-string'
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";


class Reply extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            replyEmail: '',
            submitted: false,
            message: '',
            requestId: '',
            retrieve: '',
            ticketStatus: '',
        }


    }

    componentDidMount() {
        const values = queryString.parse(this.props.location.search)
        console.log(values.email) // "top"
        this.setState({replyEmail: values.email});
    }


    changeStateInputValue = e => {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => {
                console.log(this.state.inputValue);
            }
        );
    };


    retrieveStatus = (e) => {
        const config = {
            mode: 'no-cors',
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
            }
        }
        e.preventDefault();
        axios.get(` https://kebh02i127.execute-api.us-east-2.amazonaws.com/dev/user/details/${this.state.retrieve}`,config)
            .then(res => {
                this.setState({retrieve: "", ticketStatus: res.data.users[0]});

            }).catch(error => {
            this.setState({status: false});
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {userName, replyEmail, message, subject} = this.state;
        const config = {
            mode: 'no-cors',
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
            }
        }
        axios.post(`https://kebh02i127.execute-api.us-east-2.amazonaws.com/dev/save/receipt`, {
            userName,
            replyEmail,
            message,
            subject
        }, config)
            .then(res => {
                this.setState({submitted: true, requestId: res.data.ticketId});
                console.log(res);
                console.log(res.data);
            }).catch(error => {
            this.setState({status: false});
        });
        document.getElementById('reply-form').reset();
        this.setState({userName: "", replyEmail: "", message: "", subject: ""});
    }

    render() {
        const {classes} = this.props;
        return (
            <MDBContainer>
                <MDBRow>
                    <MDBCol md="6">
                        <div className="">
                            <form id="reply-form">
                                <p className="h5 text-center mb-4">Reply to us</p>
                                <div className="grey-text">
                                    <MDBInput
                                        icon='envelope'
                                        type='text'
                                        name='userName'
                                        label='your name'
                                        group
                                        onChange={this.changeStateInputValue}
                                        validate
                                        error='error'
                                        success='success'
                                        className='form-control'
                                        value={this.state.userName}
                                    />
                                    <MDBInput label="To email" name='email'
                                              onChange={this.changeStateInputValue}
                                              icon="envelope" group type="email" validate
                                              error="wrong"
                                              success="right"
                                              value={this.state.replyEmail}
                                    />
                                    <MDBInput label="Subject"
                                              name='subject'
                                              onChange={this.changeStateInputValue}
                                              icon="tag" group type="text"
                                              validate error="wrong"
                                              success="right"
                                              value={this.state.subject}
                                    />
                                    <MDBInput type="textarea" rows="3" name='message'
                                              onChange={this.changeStateInputValue}
                                              label="Your message" icon="pencil-alt"
                                              value={this.state.message}
                                    />
                                </div>
                                <div className="text-center">
                                    <MDBBtn onClick={(e) => {
                                        this.handleSubmit(e, this)
                                    }} outline color="secondary">
                                        <MDBIcon far icon="paper-plane" className="ml-1"/>
                                    </MDBBtn>
                                </div>
                            </form>
                        </div>
                    </MDBCol>
                </MDBRow>
                <MDBRow>
                    {this.state.submitted && this.state.requestId && <React.Fragment>
                        <Typography variant="subtitle1">
                            The filing request #{this.state.requestId} is initiated.
                            <Paper>
                                <form noValidate autoComplete="off">
                                    <MDBInput label="Enter your receipt number"
                                              name='retrieve'
                                              onChange={this.changeStateInputValue}
                                              icon="tag" group type="text"
                                              validate error="wrong"
                                              success="right"
                                              value={this.state.retrieve}
                                    />
                                    <Typography/>
                                    <Button
                                        onClick={this.retrieveStatus}
                                        variant="contained"
                                        color="inherit"
                                    >
                                        retrieve
                                    </Button>
                                </form>
                            </Paper>
                        </Typography>
                        <MDBContainer>
                            {this.state.ticketStatus &&
                            < React.Fragment>
                                < MDBRow>
                                    < MDBBox display="flex" color="red">
                                        Message: <p style={{color: 'green'}}>{this.state.ticketStatus.message}</p>
                                    </MDBBox>
                                </MDBRow>
                                <MDBRow>
                                    <MDBBox display="flex" color="red">
                                        TicketId: <p style={{color: 'green'}}>{this.state.ticketStatus.ticketId}</p>
                                    </MDBBox>
                                </MDBRow>
                                <MDBRow>
                                    <MDBBox display="flex" color="red">
                                        UserName: <p style={{color: 'green'}}>{this.state.ticketStatus.name}</p>
                                    </MDBBox>
                                </MDBRow>
                                <MDBRow>
                                    <MDBBox display="flex" color="red">
                                        Status: <p style={{color: 'green'}}>Pending for approval</p>
                                    </MDBBox>
                                </MDBRow>
                            </React.Fragment>
                            }
                        </MDBContainer>
                    </React.Fragment>
                    }
                </MDBRow>
            </MDBContainer>
        );
    }
}

export default Reply;

