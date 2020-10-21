import React, { Component } from 'react'

import { Button, Box, ButtonGroup } from '@material-ui/core';
import axios from 'axios';

import { ButtonCounter } from '../components/ButtonCounter'

export class Manager extends Component {

    state = { counters: [], requestTypes: [] }

    componentDidMount() {
        //Get request Types
        var reqList = []
        axios.get(`http://localhost:3001/api/counters/requestTypes`)
            .then(res => {
                res.data.map((obj) => reqList.push(obj.RequestType))
                console.log(reqList)
                this.setState({ requestTypes: reqList })
            })
        

        //Get counters and requests
        var countersNum = 3
        let counters = []
        let reqList2 = []

        for (let i = 1; i <= countersNum; i++) {
            

            axios.get(`http://localhost:3001/api/counters/${i}/requestTypes`)
                .then(res => {
                    reqList2=[]
                    res.data.map((obj) => reqList2.push(obj.RequestType))
                    console.log(i)
                    console.log(res.data)
                    console.log(reqList2)
                    counters.push({ counterId: i, reqTypes: reqList2 })
                    console.log(counters)
                    this.setState({ counters: counters })
                })
            

        }
        
    }

    render() {

        const { counters, requestTypes, assignedReq } = this.state

        return (
            <div >
                <h1>Counter Management</h1>
                <Box className='vertical-center'>
                    <ButtonGroup orientation='vertical' size="large" variant="contained" color="primary" aria-label="large outlined primary button group">
                        {counters !== undefined ? counters.map((counter) =>
                            <div>
                                <ButtonCounter counter={counter} requestTypes={requestTypes}></ButtonCounter>
                                <br />
                            </div>
                        )
                            : <p> Add new counters</p>}
                    </ButtonGroup>
                </Box>
            </div>
        )
    }
}