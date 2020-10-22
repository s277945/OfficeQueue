import React, { Component } from 'react'

import { Button, Box, ButtonGroup } from '@material-ui/core';
import axios from 'axios';

import { ButtonCounter } from '../components/ButtonCounter'

export class Manager extends Component {

    state = { counters: [], requestTypes: [] }

    async componentDidMount() {
        //Get request Types
        var reqList = []
        axios.get(`http://localhost:3001/api/requestTypes`)
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


            let res = await axios.get(`http://localhost:3001/api/counters/${i}/requestTypes`)

            reqList2 = []
            res.data.map((obj) => reqList2.push(obj.RequestType))
            console.log(i)
            console.log(res.data)
            console.log(reqList2)
            counters.push({ counterId: i, reqTypes: reqList2 })
            console.log(counters)
            this.setState({ counters: counters })

        }

    }

    render() {

        const { counters, requestTypes, assignedReq } = this.state

        return (
            <div>
                <div ><h1>Counter Management</h1></div>                 
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>{counters !== undefined ? counters.map((counter) =>
                                    <ButtonCounter  counter={counter} requestTypes={requestTypes}></ButtonCounter>  
                        )
                            : <p> Add new counters</p>} </div>                                                                 
            </div>
        )
    }
}