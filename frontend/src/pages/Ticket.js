import React, { Component } from 'react'
import { Button, Box, ButtonGroup } from '@material-ui/core';
import axios from 'axios';

export class Ticket extends Component {
    state = {
        request_types: [],
        ticket: null
    }

    componentDidMount(){
        axios.get(`https://5f8ef6f0693e730016d7ab61.mockapi.io/RequestType`)
        .then(res => {
          this.setState({request_types: res.data})
        })
    }

    // dirty setup to try axios
    onRequestTypeClick(request_type){
        axios.post(`https://localhost:3001/api/tickets`, {requestType : request_type})
        .then(res => {
          this.setState({ticket: res.data})
        })
    }

    render() {
        if(!this.state.ticket){
            return this.renderRequestList()
        }
        else return this.renderTicket();
    }

    renderRequestList(){
        return (
            <Box display="flex" mx={5} justifyContent="center" >
                <ButtonGroup fullWidth orientation="vertical" variant="contained" size="large" color="primary" aria-label="large outlined primary button group">
                    {this.state.request_types.map(request_type => 
                        <Button key={request_type.request_type} onClick={() => this.onRequestTypeClick(request_type.request_type)}>{request_type.request_type}</Button>
                    )}
                </ButtonGroup>
            </Box>
        )
    }

    renderTicket(){
        return (
            <Box display="flex" mx={5} justifyContent="center" >
                <p>Your ticket is : {this.state.ticket.id}</p>
            </Box>
        )
    }
}