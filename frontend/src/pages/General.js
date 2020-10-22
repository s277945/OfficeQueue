import React, { Component } from 'react'
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];

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
                    <TableHead>
                    <TableRow>
                        <TableCell align="right">Counter</TableCell>
                        <TableCell align="right">RequestTypes</TableCell>
                        <TableCell align="right">TicketNumber</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.data.map(elem => 
                        <TableRow key={elem[0].counterId}>
                        <TableCell component="th" scope="row">
                            {elem[0].counterId}
                        </TableCell>
                        <TableCell align="right">{elem[0].requestType}</TableCell>
                        <TableCell align="right">{elem[0].ticketId}</TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </TableContainer>
            </div>
        )
    }
}