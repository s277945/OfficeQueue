import React, { Component } from 'react'
import wall from './wall.png';
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

    updateReq = (newRequestType) => {
        let newreq = this.state.requestTypes;
        newreq.push(newRequestType);
        this.setState({ requestTypes: newreq });
    }

    deleteReq = (counter, requestType) => {
        let newcounters = this.state.counters;
        console.log(newcounters);
        let newcounter = newcounters[counter-1];
        newcounter.reqTypes = newcounter.reqTypes.filter(req=>{return req!==requestType});
        console.log(newcounter);
        newcounters[counter-1] = newcounter;
        this.setState({ counters: newcounters });
    }

    addReq = (counter, requestType) => {
        let newcounters = this.state.counters;
        console.log(newcounters);
        let newcounter = newcounters[counter-1];
        newcounter.reqTypes.push(requestType);
        console.log(newcounter);
        newcounters[counter-1] = newcounter;
        this.setState({ counters: newcounters });
    }
    render() {

        const { counters, requestTypes, assignedReq } = this.state

        return (
            <div style={{minHeight: '950px', backgroundImage: `url(${wall})`}}>
                <div style={{display: 'flex', flexGrow: '1', backgroundColor: '#282c34', minHeight: '80px', justifyContent: 'center', alignContent: 'center'}}><h1 style={{color: '#fff'}}>Counter Management</h1></div>                 
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>{counters !== undefined ? counters.map((counter) =>
                                    <ButtonCounter addReq={this.addReq} deleteReq={this.deleteReq} updateReq={this.updateReq}  counter={counter} requestTypes={requestTypes}></ButtonCounter>  )
                            : <p> Add new counters</p>} </div>                                                                 
            </div>
        )
    }
}