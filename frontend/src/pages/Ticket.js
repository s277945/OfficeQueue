import React, { Component } from 'react'
import { Button, Box, ButtonGroup } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';
import userwall from './userwall.png';

export class Ticket extends Component {
    state = {
        request_types: [],
        ticketId: null,
        currentRequestType: null,
        modal1: false
    }

    componentDidMount(){
        axios.get(`http://localhost:3001/api/counters/requestTypes`)
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
        this.setState({ modal1: true })
    }

    render() {
            return this.renderRequestList()
        }
    renderRequestList(){
        return (
            <div style={{ minHeight: '950px', backgroundImage: `url(${userwall})`}}>
                <Dialog open={this.state.modal1} onClose={() => { this.setState({ modal1: false }) }}>
                    <DialogTitle id="dialog-title"><p style={{textAlign: 'center'}}>Your ticket number is: </p><p style={{fontWeight: 'bold', fontSize: '30px', textAlign: 'center'}}>{this.state.ticketId}</p><p style={{textAlign: 'center'}}>  for {this.state.currentRequestType}</p></DialogTitle>
                </Dialog>
                <div style={{ display: 'flex', flexGrow: '1', backgroundColor: '#282c34', minHeight: '80px', justifyContent: 'center', alignContent: 'center' }}><h1 style={{ color: '#fff' }}>Select a service</h1></div>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    {this.state.request_types.map(request_type =>
                        <Button style={{margin: '77px',  minWidth: '150px', maxWidth: '150px', padding: '50px', fontSize: '20px'}} variant="contained" color="primary" key={request_type.RequestType} onClick={() => this.onRequestTypeClick(request_type.RequestType)}>{request_type.RequestType}</Button>
                    )}</div>
            </div>
        )
    }

}