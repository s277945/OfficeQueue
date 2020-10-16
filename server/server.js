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




/// COUNTERS ENDPOINTS ///



/*
POST /api/counters
    - body: requestType (1+), counterId
*/


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
GET /api/counters/:counterId/averageTime
    - request body: counterId
    - response body: averageTime
*/


//activate server
app.listen(port, () => console.log(`Server ready at port: ${port}`));