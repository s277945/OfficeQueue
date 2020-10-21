import React, { Component } from 'react'

import { Button, Box, ButtonGroup } from '@material-ui/core';
import axios from 'axios';

import { ButtonCounter } from '../components/ButtonCounter'

export class Manager extends Component {

    state = { counters: [], requestTypes: [] }

    componentDidMount() {
        // axios.get(`https://3001/api/counters/:counterId/currentId`)
        // .then(res => {
        //   console.log(res);
        //   console.log(res.data);
        // })
        this.setState({ requestTypes: ['type1', 'type2', 'type3', 'type4'] })
        this.setState({ counters: [{counterId: '1', reqTypes:['type1', 'type2', 'type3']},{counterId: '2', reqTypes:['type1', 'type2']},{counterId: '3', reqTypes:[]}]})
    }

    render() {

        const { counters, requestTypes, assignedReq } = this.state

        return (
            <div >
                <h1>Counter Management</h1>
                <Box className='vertical-center'>
                    <ButtonGroup orientation='vertical' size="large" variant="contained" color="primary" aria-label="large outlined primary button group">
                        { counters !== undefined ? counters.map((counter) =>
                            <div>
                                <ButtonCounter counter={counter} requestTypes={requestTypes}></ButtonCounter>
                                <br/>
                            </div>
                        )
                        : <p> Add new counters</p>}
                    </ButtonGroup>
                </Box>
            </div>
        )
    }
}