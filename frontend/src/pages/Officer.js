import React, { Component } from 'react'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Button, Box, ButtonGroup } from '@material-ui/core';
import axios from 'axios';

export class Officer extends Component {

    state = { counterNum: 3, selectValue: '' }

    handleNext=()=>{
        console.log(this.state.selectValue)

        axios.get(`http://localhost:3001/api/counters/${this.state.selectValue}/next`)
        .then(res => {
            console.log(res.data)
            this.setState({request_types: res.data})
        })
    }

    render() {
        let menu=[]
        for(let i=1;i<=this.state.counterNum;i++)
            {menu.push(<MenuItem value={i}>Counter {i}</MenuItem>)}

        return (
            <div>
                <h1>Officer</h1>
                <p>Slect counter:</p>
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
                <Button variant="contained" color="primary" onClick={this.handleNext}>Next </Button>
            </div>
        )
    }
}