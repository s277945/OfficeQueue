'use strict';

const Vehicle = require('./vehicle');
const Rent = require('./rent');
const db = require('./db');
const moment = require('moment');
const DisplayRent = require('./DisplayRent');




/**
 * GET ALL VEHICLES from DB
 */

exports.getVehicles = function(){
    return new Promise((resolve, reject) => {
        const sql = "select * from vehicles";
        db.all(sql, (err, rows) => {
            if (err) reject(err);
            else {
                
                let vehicles = rows.map((row)=> new Vehicle(row.id, row.model, row.brand, row.category));
                resolve(vehicles);
            }
        })
    })
}

/**
 * GET: for each authenticated user, retrieve her rents
 */
exports.getRents = function(user){
    return new Promise((resolve, reject) => {
        const sql = `select R.id, R.start_date, R.end_date, R.import, v.category
        from rents as R, vehicles as v
        where R.id_vehicle = v.id and R.id_user = ?;`;
        db.all(sql, [user], (err, rows) => {
            if (err)
                reject(err);
            else {
                let rents = rows.map((row) => new DisplayRent(row.id, row.start_date, row.end_date, row.category, row.import));
                resolve(rents);
            }
        })
    })
}


exports.getAvailableVehicles = function(category, start_date, end_date){
    return new Promise((resolve, reject) => {
        const sql = `select id
        from vehicles 
        where category = ? and id not in (select id_vehicle
                                from rents	
                                where (start_date<=date(?) and end_date>=date(?)) or
                                        (start_date<=date(?) and end_date>=date(?)) or
                                        (start_date>=date(?) and end_date<=date(?)) )`;
        
        db.all(sql, [category, start_date, start_date, end_date, end_date, start_date, end_date], (err, rows) => {
            if(err)
                reject(err);
            else {
                let vehicles = rows;
                resolve(vehicles);
            }
            })
    })
}

/**
 * 
 * INSERT NEW RENT INTO THE DB
 */
exports.addRent = function(rent){
    rent.start_date = moment(rent.start_date).format("YYYY-MM-DD");
    rent.end_date = moment(rent.end_date).format("YYYY-MM-DD");

    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO rents(id_user, id_vehicle, start_date, end_date, age_driver, n_additional_drivers, km, extra_warranty, import)
                    VALUES (?,?,?,?,?,?,?,?,?)`;
        db.run(sql, [rent.id_user, rent.id_vehicle, rent.start_date, rent.end_date, rent.age, rent.additional_drivers, rent.km, rent.warranty, rent.import], function(err){
            if(err){
                reject(err);
            }
            else {
                resolve(this.lastID);
            }
        });
    });
}


/**
 * DELETE A RENT FROM THE DB
 */

 exports.deleteRent = function(rent_id){
     return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM rents WHERE id = ?';
        db.run(sql, [rent_id], (err) => {
            if(err)
                reject(err);
            else
                resolve(null);
        })
     });
 }


/**
 * FAKE PAYMENT
 */
exports.payRent = function(){
    return new Promise((resolve, reject) => {
        resolve(true);
    })
}



