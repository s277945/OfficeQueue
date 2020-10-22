import React, { Component } from 'react'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Button, Box, ButtonGroup } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';
import userwall from './userwall.png';
import Card from '@material-ui/core/Card';

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
            <div style={{ minHeight: '950px', backgroundImage: `url(${userwall})`}}>
                <div style={{display: 'flex', flexDirection: 'column', backgroundColor: '#282c34', minHeight: '80px', justifyContent: 'center', alignContent: 'center'}}><h1 style={{color: '#fff'}}>Officer</h1></div>
                <p style={{fontSize: '30px', fontWeight: 'bold', color: '#fff', paddingTop: '40px'}}>Select counter:</p>
                <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', alignContent: 'flex-start' }}>
                    <Button style={{margin: '77px',  minWidth: '150px', maxWidth: '150px', padding: '50px', fontSize: '20px'}} variant="contained" color="primary" key={1} onClick={() => {this.setState( {selectValue: 1}); this.dialogOpen();}}>COUNTER 1</Button>
                    <Button style={{margin: '77px',  minWidth: '150px', maxWidth: '150px', padding: '50px', fontSize: '20px'}} variant="contained" color="primary" key={2} onClick={() => {this.setState( {selectValue: 2}); this.dialogOpen();}}>COUNTER 2</Button>
                    <Button style={{margin: '77px',  minWidth: '150px', maxWidth: '150px', padding: '50px', fontSize: '20px'}} variant="contained" color="primary" key={3} onClick={() => {this.setState( {selectValue: 3}); this.dialogOpen();}}>COUNTER 3</Button>

                    <Dialog open={this.state.dialog} onClose={this.dialogClose}>
                        <DialogTitle id="dialog-title">
                            <p style={{fontSize: '35px', fontWeight: 'bold', textAlign: 'center'}}>Counter {this.state.selectValue}</p>
                            {(this.state.ticketNumber!=='' && this.state.ticketNumber!==0) && <><p style={{textAlign: 'center'}}>Next ticket number is: </p><p style={{fontWeight: 'bold', fontSize: '30px', textAlign: 'center'}}>{this.state.ticketNumber}</p>
                            <p style={{textAlign: 'center'}}>  for request type:</p>
                            <p style={{fontSize: '25px', fontWeight: 'bold', textAlign: 'center'}}>{this.state.requestType.toUpperCase()}</p></>}                        
                        </DialogTitle>
                        <Button style={{padding: '20px'}}  variant="contained" color="primary" onClick={this.handleNext}>Next </Button>
                    </Dialog>
                </div>      
            </div>
        )
    }
}