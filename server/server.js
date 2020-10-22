'use strict';



//import express
const express = require('express');
const dao = require('./dao');
const morgan = require('morgan'); // logging middleware
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const moment = require('moment');


//create application
const app = express();
const port = 3001;

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());

// Enable cors
app.use(cors());

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
POST /api/tickets
    - request body: {"requestType": "payment"}
    - response body: ticketId
*/

app.post('/api/tickets', (req, res) => {
    const requestType = req.body.requestType;
    
    /**
     * check if requestType is ok
     * possibly check it with express validator
     * matching available request types 
     */

    if(!requestType) return res.status(400).json({errors: 'Invalid requestType'});

    dao.addTicket(requestType)
        .then((ticketId) => res.status(201).json({"ticketId": ticketId}))
        .catch(err => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }));
});


/// COUNTERS ENDPOINTS ///


/**
 * GET /api/requestTypes
 * 
 * retrieves list of all available requestType
 */

app.get('/api/requestTypes', (req, res)=>{
    dao.getAllRequestTypes()
        .then((list) => res.status(201).json(list))
        .catch(err => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }));
});




/**
 * GET /api/counters/requestTypes
 * 
 * retrieves list of available requestType served by counters
 */

app.get('/api/counters/requestTypes', (req, res)=>{
    dao.getCounterRequestType()
        .then((list) => res.status(201).json(list))
        .catch(err => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }));
});

/**
 * GET /api/counters/:counterId/requestTypes
 * 
 * retrieves list of served requestType by a counter
 */

app.get('/api/counters/:counterId/requestTypes', (req, res)=>{
    dao.getRequestType(req.params.counterId)
        .then((list) => res.status(201).json(list))
        .catch(err => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }));
});

/*
endpoint for add requestType for a given counter (param counterId) MANAGER

POST /api/counters/:counterId
    - body: { "requestType": "payment"}
    - params: counterId
*/

app.post('/api/counters/:counterId', (req, res) => {
    const requestType = req.body.requestType;
    const counterId = req.params.counterId;
    //console.log(counterId);

    if(!requestType) return res.status(400).json({errors: 'Invalid requestType'});

    dao.insertRequestType(counterId, requestType)
        .then((response) => {
            res.status(201).json({"msg": "row inserted: " + response})
        })
        .catch(err => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }));
});

/*
endpoint for delete a requestType from a given counter (param counterId) MANAGER

DELETE /api/counters/:counterId
    - body: { "requestType": "payment"}
    - params: counterId
*/

app.delete('/api/counters/:counterId', (req, res) => {
    const requestType = req.body.requestType;

    if(!requestType) return res.status(400).json({errors: 'Invalid requestType'});

    dao.deleteRequestType(req.params.counterId, requestType)
        .then((response) => {
            res.status(201).json({"msg": "row deleted: " + response})
        })
        .catch(err => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }));
});

/*
GET /api/counters/:counterId/next MAIN PAGE ///DOESNT WORK
    - response body: requestType (1+) 
*/
app.get('/api/counters/:counterId/next', (req, res) => {
    //read requestTypes for selected counter id from database
    dao.searchByCounterID(req.params.counterId)
    .then((result) => {res.status(200).json(result)}) // all went smoothly
    .catch((err) => {res.status(403)})// error response
});

/*
GET /api/counters/:counterId/nextId
    - request body: counterId
    - response body: ticketId
*/

app.get('/api/counters/:counterId/nextId', (req, res) => {     //read current id for selected counter id from database     
    dao.searchByCounterID(req.params.counterId)     
    .then((result) => {res.status(200).json(result)}) // all went smoothly     
    .catch((err) => {res.status(403).json({ errors: [{ 'param': 'Server', 'msg': err }] })})// error response
});

/*
GET /api/counters/currentId
    - request body: counterId
    - response body: example {"counterId": 1, "ticketId": 234}
*/
app.get('/api/counters/currentId', (req, res) => {
    //read current id for selected counter id from database
    dao.showServed()
    .then((result) => {res.status(200).json(result)}) // all went smoothly
    .catch((err) => {res.status(403).json({ errors: [{ 'param': 'Server', 'msg': err }] })})// error response
});


/*
??
GET /api/counters/:counterId/currentId
    - request body: counterId
    - response body: ticketId
*/
app.get('/api/counters/:counterId/currentId', (req, res) => {
    //read current id for selected counter id from database
    dao.showServedById(req.params.counterId)//??
    .then((result) => {res.status(200).json(result)}) // all went smoothly
    .catch((err) => {res.status(403)})// error response
})



/*
GET /api/counters/:counterId/averageTime
    - request body: counterId
    - response body: averageTime

app.get('/api/counters/:counterId/averageTime', (req, res) => {
    //read current id for selected counter id from database
    dao.getAverageTime(req.params.counterId)//??
    .then((result) => {res.status(200).json(result)}) // all went smoothly
    .catch((err) => {res.status(403)})// error response
})
*/

/**
 * POST /api/requestTypes
 * - request body: {"requestType" : "xd", "avgTime": 23434}
 * 
 */

app.post('/api/requestTypes', (req, res) => {
    const requestType = req.body.requestType;
    const avgTime = req.body.avgTime;
    

    if(!requestType) return res.status(400).json({errors: 'Invalid requestType'});

    dao.insertNewRequestType(requestType, avgTime)
        .then((response) => {
            res.status(201).json({"msg": "row inserted: " + response})
        })
        .catch(err => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }));
});

//activate server
app.listen(port, () => console.log(`Server ready at port: ${port}`));