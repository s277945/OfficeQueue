'use strict';
const db = require('./db');

/**
 * Insert
 * Input RequestType
 * Return QueueNumber
 *
* */
exports.addTicket = function(requestType){
    let date=new Date();
    return new Promise ((resolve, reject) => {
        searchMax(requestType)
            .then((max) => {
                const sql = `INSERT INTO Queue(QueueNumber, RequestType, Day, Month, Year)
                        VALUES (?,?,?,?,?)`;
                db.run(sql, [max+1, requestType, date.getDate(), date.getMonth()+1, date.getFullYear()], function(err){
                    if(err){
                        reject(err);
                    }
                    else {
                        console.log('Row inserted');
                        resolve(max+1);
                    }
                });
            }).catch(
            (err)=> {throw new SQLException();
            });
    });
}

    function searchMax(requestType){
        return new Promise ((resolve, reject) => {
            const sql = 'SELECT MAX(QueueNumber) AS QueueNum FROM Queue WHERE RequestType=?';
            db.get(sql, [requestType],(err, row) => {
                if (err)
                    reject(err);
                else {
                    if(row==undefined)
                        resolve(0);
                    else
                        resolve(row);
                }
            })
        });
    }

    /***
     * AutoRefresh MainBoard
     * Output QueueNumber*/
    exports.showServed=function () {
        let map=new Map()
        return new Promise ((resolve, reject) => {
            const sql = 'SELECT  CounterID, TicketNumber FROM ServedTicket';
            db.get(sql,(err, rows) => {
                if (err)
                    reject(err);
                else {
                    rows.forEach(row=>{
                        map.set(row.counterID, row.TicketNumber);
                    });
                    resolve(map);
                }
            })
        });

    }
    /**
     * Insert request type to counter
     * Input CounterID, RequestType
     **/
    exports.insertRequestType=function(counterID,requestType,avgTime){
        return new Promise((resolve, reject) => {
            const sql='INSERT INTO CounterRequest VALUES(?,?,?) ';
            db.run(sql, [counterID,requestType,avgTime], function(err){
                if(err){
                    reject(err);
                }
                else {
                    console.log('Row inserted');
                    resolve(true);
                }
            });
        })
    }
    /**
     * Delete, same as above*/
    exports.deleteRequestType=function(counterID,requestType){
        return new Promise((resolve, reject) => {
            const sql='DELETE FROM CounterRequest WHERE counterID=? AND requestType=? ';
            db.run(sql, [counterID,requestType], function(err){
                if(err){
                    reject(err);
                }
                else {
                    console.log('Row deleted');
                    resolve(true);
                }
            });
        })
    }
exports.searchByCounterID=function(counterID){
        let max=0;
        let reqType;
        let i=0;
        return new Promise((resolve, reject) => {
           const sql='SELECT requestType FROM CounterRequest WHERE counterID=?';
           db.all(sql,[counterID],(err,rows)=>{
               if(err)
                   reject(err);
               else{
                            rows.forEach(row=>{
                               countQueue(row).then((lenght)=>{
                                if(lenght>=max){

                                    /*if(lenght==max){
                                        i++;
                                        reqType+=' '+row.toString();

                                    }*/
                                    /*else {*/
                                       // i=0;
                                        reqType = row.toString();
                                    //}
                                    max = lenght;

                                }

                               })
                                   .catch(
                                       (err)=> {throw new SQLException();
                                       });
                           }

                       );
                            //if(i>0){
                                //select min avgTime from the elements of reqTime vector
                            //}
                       selectMinTicket(reqType).then(minTicket=>{
                           deleteQueueTicket(reqType,minTicket).then(returnValue=>{
                               if(returnValue)
                               {
                                   updateServed(counterID,reqType,minTicket).then(returnVal=>{
                                       if(returnVal)
                                           console.log('update done');
                                   })
                               }
                           }).catch((err)=>{throw new SQLException();})
                       }).catch((err)=>{
                           throw  new SQLException();
                       })


               }
           } );
        });
}
function countQueue(requestType){
        return new Promise((resolve, reject) => {
            const sql='SELECT COUNT(*) FROM Queue WHERE requestType=?';
            db.get(sql, [requestType], (err, row)=>{
                if(err)
                    reject(err);
                else
                    resolve(row);
            })
        })
}
function selectMinTicket(requestType){
        return new Promise((resolve, reject) => {
            const sql='SELECT MIN(QueueNumber) AS minTicket FROM Queue WHERE RequestType=? ';
            db.get(sql,[requestType], (err,row)=>{
                if(err)
                    reject(err);
                else{
                    resolve(row.minTicket)
                }
            })
        })
}
function deleteQueueTicket(requestType,minTicket){
        return new Promise((resolve, reject) => {
            const sql='DELETE FROM Queue WHERE RequestType=? AND QueueNumber=?';
            db.run(sql,[requestType,minTicket],function(err){
                if(err)
                    reject(err);
                else
                    resolve(true);
            })
        })

}
//insertServed and delete Served
function updateServed(counterID,requestType,ticketNumber){
        return new Promise((resolve, reject) => {
            const sql='UPDATE ServedTicket SET RequestType=?,TicketNumber=? WHERE CounterID=?';
            db.run(sql,[requestType,ticketNumber,counterID],function(err){
                if(err)
                    reject(err);
                else{
                    resolve(true);
                }
            })
        })
}
