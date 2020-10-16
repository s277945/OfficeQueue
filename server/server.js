'use strict';



//import express
const express = require('express');
const rentDao = require('./rent_dao');
const userDao = require('./user_dao');
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator');
const moment = require('moment');

const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const expireTime = 300;
// Authorization error
const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };



//create application
const app = express();
const port = 3001;

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());


/*REST API ENDPOINT*/

/**
 * GET: /api/vehicles
 * 
 * Retrieves all vehicles from DB
 */

app.get('/api/vehicles', (req, res) => {
    rentDao.getVehicles()
        .then((vehicles) => {
            res.json(vehicles);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});


/**
 * Authentication Endpoint
 * Take username and Password of requesting user
 */

app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    userDao.getUser(username)
        .then((user) => {

            if (user === undefined) {
                /**
                 * Authentication Failed due to Invalid email
                 */
                res.status(404).send({
                    errors: [{ 'param': 'Server', 'msg': 'Invalid email' }]
                });
            } else {
                if (!userDao.checkPassword(user, password)) {
                    /**
                     * Authentication failed due to WRONG PASSWORD
                     */

                    res.status(401).send({
                        errors: [{ 'param': 'Server', 'msg': 'Wrong password' }]
                    });
                } else {
                    /**
                     * Authentication SUCCESS
                     */
                    const token = jsonwebtoken.sign({ user: user.id }, jwtSecret, { expiresIn: expireTime });
                    res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
                    res.json({ id: user.id, name: user.name });
                }
            }
        }).catch(

            // Delay response when wrong user/pass is sent to avoid fast guessing attempts
            (err) => {
                new Promise((resolve) => { setTimeout(resolve, 1000) }).then(() => res.status(401).json(authErrorObj))
            }
        );
});

app.use(cookieParser());

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});


/**
 * From this point, next endpoints need authentication to work
 * 
 * AUTHENTICATED REST API endopoints
 */

app.use(
    jwt({
        secret: jwtSecret,
        getToken: req => req.cookies.token
    })
);

// To return a better object in case of errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json(authErrorObj);
    }
});


//GET USER RENTS, IF ANY
app.get('/api/rents', (req, res) => {
    const user = req.user && req.user.user;
    rentDao.getRents(user)
        .then((rents) => {
            res.json(rents);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }]
            });
        });
});


//GET /user
app.get('/api/user', (req, res) => {
    const user = req.user && req.user.user;
    userDao.getUserById(user)
        .then((user) => {
            res.json({ id: user.id, name: user.name});
        }).catch(
            (err) => {
                res.status(401).json(authErrorObj);
            }
        );
});


//GET AVAILABLE VEHICLES FOR A GIVEN CONFIGURATION 
app.get('/api/available_vehicles', (req, res) => {
    let category = req.query.category;
    let startDate = req.query.start_date;
    let endDate = req.query.end_date;
    rentDao.getAvailableVehicles(category, startDate, endDate)
        .then((vehicles) => {
            res.json(vehicles);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }]
            });
        });
});


/**
 * POST /rents
 * 
 * ADD A NEW RENT FOR A GIVEN USER 
 */
app.post('/api/rents', [
    check('id_vehicle').isInt({ min: 0, max: 200 }),
    check('start_date').isISO8601(),
    check('end_date').isISO8601(),
    check('age').isString().isLength({ min: 2, max: 2 }),
    check('additional_drivers').isString().isLength({ min: 1, max: 1 }),
    check('km').isString().isLength({ min: 1, max: 40 }),
    check('warranty').isString().isLength({ min: 2, max: 3 }),
    check('import').isFloat(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    
    //check if end date is before start date -> in that case, return error
    const rent = req.body;
    if (moment(rent.end_date).isBefore(moment(rent.start_date)))
        return res.status(422).json({ errors: 'Invalid end date' });


    //if rent is not present return 400
    if (!rent) res.status(400).end();
    else {
        const user = req.user && req.user.user;
        rent.id_user = user;
        rentDao.addRent(rent)
            .then((id) => res.status(201).json({ "id": id }))
            .catch(err => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }));
    }
})


/**
 * DELETE /rents/:rentId
 */

app.delete('/api/rents/:rentId', (req, res) => {
    rentDao.deleteRent(req.params.rentId)
        .then(() => res.status(204).end())
        .catch((err) => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }));
})

/**
 * FAKE PAYMENT API
 */

app.post('/api/payment', (req, res) => {
    rentDao.payRent()
        .then(() => res.status(200).json({ "status": "ok" }))
        .catch((err) => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }));
})



//activate server
app.listen(port, () => console.log(`Server ready at port: ${port}`));