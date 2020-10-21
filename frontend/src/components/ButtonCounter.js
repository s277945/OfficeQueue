import React, { Component } from 'react'

import { Button, Box, ButtonGroup } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

export class ButtonCounter extends Component {

    state = { modal1: false }

    handleOpen = () => {
        this.setState({ modal1: true });
    };

    handleClose = () => {
        this.setState({ modal1: false });
    };

    addToCounter = (counter, request) => {
        //axios post counter,request
        console.log(counter, request)
    }

    deleteFromCounter = (counter, request) => {
        //axios post counter,request
        console.log(counter, request)
    }
    newRequestType = (counter) => {
        console.log(counter)
    }

    render() {

        const { counter, requestTypes } = this.props

        return (
            <div>
                <Button variant="contained" color="primary" onClick={this.handleOpen}>Counter {counter.counterId}</Button>
                <Modal
                    open={this.state.modal1}
                    onClose={this.handleClose}>
                    <div className='modal'>
                        <div style={{ font: 'bold', textAlign: 'center' }}>Counter {counter.counterId}</div>
                        <div>
                            <div className='column'>
                                <div>Add request types:</div>
                                {requestTypes !== undefined ?
                                    requestTypes.map((request) =>
                                        <div>
                                            <div>{request}</div>
                                            <Button variant="contained" color="primary" onClick={(e) => { e.preventDefault(); this.addToCounter(counter.counterId, request) }}>Add</Button>
                                        </div>)
                                    : <p>No requests available</p>}
                            </div>
                            <div className='column'>
                                <div>Remove request types:</div>
                                {counter.reqTypes != undefined ?
                                    counter.reqTypes.map((request) =>
                                        <div>
                                            <div>{request}</div>
                                            <Button variant="contained" color="secondary" onClick={(e) => { e.preventDefault(); this.deleteFromCounter(counter.counterId, request) }}>Delete</Button>
                                        </div>)
                                    : <p>No assigned requests</p>}
                            </div>

                        </div>
                        <div>
                        </div>
                        <br />
                        <Button variant="contained" color="primary" onClick={(e) => { e.preventDefault(); this.newRequestType(counter.counterId) }}>New request type?</Button>
                    </div>
                </Modal>
            </div>
        )
    }
}