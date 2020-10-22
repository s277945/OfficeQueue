import React, { Component } from 'react'
import { Button, Box, ButtonGroup } from '@material-ui/core';
import axios from 'axios';

export class Ticket extends Component {
    state = {
        request_types: [],
        ticketId: null,
        currentRequestType: null
    }

    componentDidMount(){
        axios.get(`http://localhost:3001/api/requestTypes`)
        .then(res => {
          this.setState({request_types: res.data})
        })
    }

    onRequestTypeClick(request_type){
        this.setState({currentRequestType : request_type})
        axios.post(`http://localhost:3001/api/tickets`, {requestType : request_type})
        .then(res => {
          this.setState({ticketId: res.data.ticketId})
          console.log(res.data)
        })
    }

    render() {
        if(!this.state.ticketId){
            return this.renderRequestList()
        }
        else return this.renderTicket();
    }

    renderRequestList(){
        return (
            <Box display="flex" mx={5} justifyContent="center" >
                <ButtonGroup fullWidth orientation="vertical" variant="contained" size="large" color="primary" aria-label="large outlined primary button group">
                    {this.state.request_types.map(request_type => 
                        <Button key={request_type.RequestType} onClick={() => this.onRequestTypeClick(request_type.RequestType)}>{request_type.RequestType}</Button>
                    )}
                </ButtonGroup>
            </Box>
        )
    }

    renderTicket(){
        return (
            <Box display="flex" mx={5} justifyContent="center" >
                <p>Your ticket is number : {this.state.ticketId}  for {this.state.currentRequestType}</p>
            </Box>
        )
    }
}