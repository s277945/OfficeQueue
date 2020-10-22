import React, { Component } from 'react'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Button, Box, ButtonGroup } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';

export class Officer extends Component {

    state = { counterNum: 3, selectValue: '', dialog: false, requestType: '', ticketNumber: ''}

    dialogOpen = () => {
        this.setState({ dialog : true });
    }

    dialogClose = () => {
        this.setState({ dialog : false });
    }
    

    handleNext=()=>{
        console.log(this.state.selectValue)

        axios.get(`http://localhost:3001/api/counters/${this.state.selectValue}/next`)
        .then(res => {
            console.log(res.data)
            if(res.status===200) this.setState({requestType: res.data[0].requestType, ticketNumber: res.data[0].ticketNumber});
        })
    }

    render() {
        let menu=[]
        for(let i=1;i<=this.state.counterNum;i++)
            {menu.push(<MenuItem value={i}>Counter {i}</MenuItem>)}

        return (
            <div>
                <h1>Officer</h1>
                <p>Select counter:</p>
                <Select
                // open={open}
                // onClose={handleClose}
                // onOpen={handleOpen}
                value={this.state.selectValue}
                onChange={(e)=>{this.setState( {selectValue: e.target.value})}}
                >
                    {
                        menu
                    }


                </Select>
                <br/>
                <br/>
                <Button variant="contained" color="primary" onClick={this.dialogOpen}>Select </Button>
                <Dialog open={this.state.dialog} onClose={this.dialogClose}>
                    <DialogTitle id="dialog-title">
                        <p style={{fontSize: '35px', fontWeight: 'bold', textAlign: 'center'}}>Counter {this.state.selectValue}</p>
                        {(this.state.ticketNumber!=='') && <><p style={{textAlign: 'center'}}>Next ticket number is: </p><p style={{fontWeight: 'bold', fontSize: '30px', textAlign: 'center'}}>{this.state.ticketNumber}</p>
                        <p style={{textAlign: 'center'}}>  for request type:</p>
                        <p style={{fontSize: '25px', fontWeight: 'bold', textAlign: 'center'}}>{this.state.requestType.toUpperCase()}</p></>}                        
                    </DialogTitle>
                    <Button style={{padding: '20px'}} variant="contained" color="primary" onClick={this.handleNext}>Next </Button>
                </Dialog>
            </div>
        )
    }
}