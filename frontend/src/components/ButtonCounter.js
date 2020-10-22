import React, { Component } from 'react'
import axios from 'axios';

import { Button, Box, ButtonGroup } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

export class ButtonCounter extends Component {

    state = { modal1: false, modal2: false, newText: '', newTime: 0 }

    handleOpen = () => {
        this.setState({ modal1: true });
    };

    handleClose = () => {
        this.setState({ modal1: false });
    };

    addToCounter = (counter, request) => {
        console.log(counter, request)
        axios.post(`http://localhost:3001/api/counters/${counter}`, { requestType: request })
            .then(res => {
                console.log(res)
                window.location.reload(false);
            })

    }

    deleteFromCounter = (counter, request) => {
        //Axios didn't work so using fetch
        // console.log(counter, request)
        // axios.delete(`http://localhost:3001/api/counters/${counter}`, { data: {requestType : request}})
        // .then(res => {
        //   console.log(res)
        //   window.location.reload(false);
        // })
        console.log(counter, request)
        fetch(`http://localhost:3001/api/counters/${counter}`, {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestType: request })
        })
            .then(res => {
                //this is not happening
            })
        window.location.reload(false);
    }
    
    newRequestType = (counter, funct) => {
        console.log(counter)
        console.log(this.state.newText,this.state.newTime)
        axios.post(`http://localhost:3001/api/requestTypes`, { requestType: this.state.newText, avgTime: this.state.newTime })
            .then(res => {
                console.log(res)
                //window.location.reload(false);
            })
            this.setState({ modal1: false });
            this.setState({ modal2: false });
            funct(this.state.newText);
    }

    render() {

        const { updateReq, counter, requestTypes } = this.props

        return (
            <div>
                <Button style={{margin: '40px', minWidth: '150px', maxWidth: '150px'}} variant="contained" color="primary" onClick={this.handleOpen}>
                <div>
                <p style={{fontSize: '20px'}}>Counter {counter.counterId}</p>
                    {counter.reqTypes.map((req)=>
                    <p style={{fontSize: '13px'}}>{req}</p>
                    )}</div>
                                
                </Button>
                <Modal open={this.state.modal1} onClose={this.handleClose}>
                    <div style={{width:'900px'}} className='modal'>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div style={{ font: 'bold', textAlign: 'center', fontSize: '40px', marginBottom: '20px'}}>Counter {counter.counterId}</div>                        
                            <div><Button variant="contained" color="light" onClick={(e) => { e.preventDefault();  this.setState({ modal1: false }) }}>x</Button></div>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                            <div className='column'>
                                <div style={{marginBottom: '10px', fontSize: '25px', marginBottom: '20px'}}>Add request types:</div>
                                {requestTypes !== undefined ?
                                    requestTypes.filter(request=>{return !counter.reqTypes.includes(request)}).map((request) =>
                                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', maxWidth: '350px',  marginBottom: '5px'}}>
                                            <div>{request.toUpperCase()}</div>
                                            <div><Button variant="contained" color="primary" onClick={(e) => { e.preventDefault(); this.addToCounter(counter.counterId, request) }}>Add</Button></div>
                                        </div>)
                                    : <p>No requests available</p>}
                            </div>
                            <div className='column'>
                                <div style={{marginBottom: '10px', fontSize: '25px', marginBottom: '20px'}}>Remove request types:</div>
                                {counter.reqTypes != undefined ?
                                    counter.reqTypes.map((request) =>
                                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', maxWidth: '350px',  marginBottom: '5px'}}>
                                            <div>{request.toUpperCase()}</div>
                                            <Button variant="contained" color="secondary" onClick={(e) => { e.preventDefault(); this.deleteFromCounter(counter.counterId, request) }}>Delete</Button>
                                        </div>)
                                    : <p>No assigned requests</p>}
                            </div>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <br />
                            <Button variant="contained" color="primary" onClick={(e) => { e.preventDefault();  this.setState({modal2: true}) }}>+</Button>
                        </div>                        
                    </div>
                </Modal>
                <Modal open={this.state.modal2} onClose={()=>{this.setState({modal2: false})}}>
                        <div className='modal'><p>Request type:</p>
                        <input type="text" value={this.state.newText} onChange={(e)=>{this.setState({newText: e.target.value})}}/>
                        <p>Request time:</p>
                        <input type="number" value={this.state.newTime} onChange={(e)=>{this.setState({newTime: e.target.value})}}/>
                        <br/>
                        <br/>
                        <Button variant="contained" color="primary" onClick={(e) => { e.preventDefault(); this.newRequestType(counter.counterId, updateReq);}}>Send</Button>
                        </div>

                </Modal>
            </div>
        )
    }
}