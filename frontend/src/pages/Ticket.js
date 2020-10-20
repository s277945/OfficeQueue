import React, { Component } from 'react'
import { Button, Box, ButtonGroup } from '@material-ui/core';
import axios from 'axios';

export class Ticket extends Component {

    // dirty setup to try axios
    requestType1Test(){
        axios.post(`https://30001/api/tickets/newTicket`, { requestType : "requestType1" })
        .then(res => {
          console.log(res);
          console.log(res.data);
        })
    }

    render() {
        return (
            <Box>
                <ButtonGroup size="large" variant="contained" color="primary" aria-label="large outlined primary button group">
                    <Button onClick={this.requestType1Test}>Request_Type1</Button>
                    <Button>Request_Type2</Button>
                    <Button>Request_Type3</Button>
                </ButtonGroup>
            </Box>
        )
    }
}