import React, { Component } from 'react'
import axios from 'axios';
import { createMuiTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export class General extends Component {
    state = {
        data: [],
    }

    componentDidMount(){
        axios.get(`http://localhost:3001/api/counters/currentId`)
        .then(res => {
          this.setState({request_types: res.data})
          console.log(res.data)
          this.setState({data: res.data})
        })
    }

    render() {

        return (
            <div>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead style={{backgroundColor: '#3F51B5'}}>
                    <TableRow>
                        <TableCell style={{color: '#fff',fontSize:30}} align="left">Counter</TableCell>
                        <TableCell style={{color: '#fff',fontSize:30}} align="center">RequestTypes</TableCell>
                        <TableCell style={{color: '#fff',fontSize:30}} align="right">TicketNumber</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.data.map(elem =>
                        <TableRow key={elem[0].counterId} style={{height: 120}}>
                        <TableCell align="left" component="th" scope="row" style={{fontSize:30}}>
                            {elem[0].counterId}
                        </TableCell>
                        {(elem[0].ticketId!==0 && elem[0].ticketId!=='') ? <><TableCell align="center" style={{fontSize:30}}>{elem[0].requestType}</TableCell></> : <><TableCell align="center" style={{fontSize:30}}>-</TableCell></>}
                        {(elem[0].ticketId!==0 && elem[0].ticketId!=='') ? <><TableCell align="right" style={{fontSize:30}}>{elem[0].ticketId}</TableCell></> : <><TableCell align="right" style={{fontSize:30}}>-</TableCell></>}
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </TableContainer>
            </div>
        )
    }
}
