'use strict';



//import express
const express = require('express');
const dao = require('./dao');
const morgan = require('morgan'); // logging middleware
const { check, validationResult } = require('express-validator');
const moment = require('moment');


//create application
const app = express();
const port = 3001;

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());

///////////////////////
///REST API ENDPOINT///
///////////////////////

/// TICKETS ENDPOINTS ///


/*
GET /api/tickets/:ticketId/serviceTime
    - request body: ticketId
    - response body: serviceTime
*/


/*
GET /api/tickets/newTicket
    - response body: ticketId
*/

app.post('/api/tickets/newTicket', (req, res) => {
    const requestType = req.body.requestType;

    if(!requestType) return res.status(400).json({errors: 'Invalid requestType'});

    dao.addTicket(requestType)
        .then((ticketId) => res.status(201).json({"ticketId": ticketId}))
        .catch(err => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }));
});




/// COUNTERS ENDPOINTS ///



/*
POST /api/counters
    - body: requestType (1+), counterId
*/

/*
GET /api/counters/:counterId/requestTypes
    - response body: requestType (1+) 
*/
app.get('/api/counters/:counterId/requestTypes', (req, res) => {
    //read requestTypes for selected counter id from database
    dao.searchByCounterID(req.params.counterId)
    .then((result) => {res.status(200).json(result)}) // all went smoothly
    .catch((err) => {res.status(403)})// error response
});

/*
PUT /api/counters/:counterId
    - body: requestType (1+) 
*/


/*
GET /api/counters/:counterId/nextId
    - request body: counterId
    - response body: ticketId
*/



/*
GET /api/counters/:counterId/currentId
    - request body: counterId
    - response body: ticketId
*/

/*
??
GET /api/counters/currentId
    - request body: counterId
    - response body: example {"counterId": 1, "ticketId": 234}
*/

/*
GET /api/counters/:counterId/averageTime
    - request body: counterId
    - response body: averageTime
*/


//activate server
app.listen(port, () => console.log(`Server ready at port: ${port}`));