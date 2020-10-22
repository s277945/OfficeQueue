'use strict';
const db = require('./db');

/**
 * Page: RequestTicketPage
 * Logic: Get the requestTypes served by at least one counter
 */
exports.getCounterRequestType=function(){
    let list=[];
    return new Promise((resolve, reject) => {
        const sql='SELECT DISTINCT RequestType FROM CounterRequest ';
        db.all(sql,(err,rows)=>{
            if(err)
                reject(err);
            else{
                rows.forEach((row)=>{
                    list.push(row)
                });
                resolve(list);
            }
        });
    });

}
/**
 * Insert
 * Input RequestType
 * Return QueueNumber
 * Page: RequestTicketPage
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
                    if(row==undefined || row.QueueNum == null)
                        resolve(0);
                    else
                        resolve(row.QueueNum);
                }
            })
        });
    }

    /***
     * AutoRefresh MainBoard
     * Output QueueNumber
     * Page: MainBoardPage
     */
    exports.showServed=function () {
        let map=new Map()
        return new Promise ((resolve, reject) => {
            const sql = 'SELECT  CounterID, RequestType, TicketNumber FROM ServedTicket';
            db.all(sql,(err, rows) => {
                if (err)
                    reject(err);
                else {
                    let list = rows.map(row => [{"counterId": row.CounterID, "requestType": row.RequestType, "ticketId": row.TicketNumber}]);
                    resolve(list);
                }
            })
        });

    }

/**
     * 
     * Output RequestTypes
     * Page: ManagerPage
     * Logic: Get all the available RequestTypes and list them
     */
    exports.getAllRequestTypes=function () { //DA VEDERE
        let list=[];
        let check= new Map();
        return new Promise((resolve, reject) => {
            const sql='SELECT RequestType FROM RequestType ';
            db.all(sql, (err,rows)=>{
                if(err)
                    reject(err);
                else{
                    resolve(rows);
            }
        });
    });
    }


    /**
     * Input CounterID
     * Output RequestType
     * Page: ManagerPage
     * Logic: Get all the RequestTypes served by the counters 
     */
    exports.getRequestType=function (counterID) { //DA VEDERE
        let list=[];
        let check= new Map();
        return new Promise((resolve, reject) => {
            const sql='SELECT RequestType FROM CounterRequest WHERE CounterID = ? ';
            db.all(sql, [counterID], (err,rows)=>{
                if(err)
                    reject(err);
                else{
                    resolve(rows);
            }
        });
    });
    }
    /**
     * Insert request type to counter
     * Input CounterID, RequestType
     **/
    exports.insertRequestType=function(counterID,requestType){
        return new Promise((resolve, reject) => {
            const sql='INSERT INTO CounterRequest VALUES(?,?) ';
            db.run(sql, [counterID,requestType], function(err){
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
    exports.deleteRequestType=function(counterID,requestType){ //DA VEDERE
        return new Promise((resolve, reject) => {
            const sql='DELETE FROM CounterRequest WHERE counterID=? AND requestType=? ';
            db.run(sql, [counterID,requestType], function(err){
                if(err){
                    console.log('error on delete');
                    reject(err);
                }
                else {
                    console.log('Row deleted');
                    resolve(true);
                }
            });
        })
    }

    exports.insertNewRequestType=function(requestType,avgTime){
        return new Promise((resolve, reject) => {
            const sql='INSERT INTO RequestType VALUES(?,?) ';
            db.run(sql, [requestType,avgTime], function(err){
                if(err){
                    reject(err);
                }
                else {
                    console.log('ReqType created');
                    resolve(true);
                }
            });
        })
    }

    exports.searchByCounterID = function (counterID) {
        let max = 0;
        let reqType;
        let i = 0;
        return new Promise((resolve, reject) => {
            const sql = 'SELECT requestType FROM CounterRequest WHERE counterID=?';
            db.all(sql, [counterID], async (err, rows) => {
                if (err)
                    reject(err);
                else {
                    console.log(rows);
                    for (let row of rows) {
                        await countQueue(row.RequestType).then((lenght) => {
                            if (lenght > 0) {
                                if (lenght >= max) {


                                    if (lenght == max) {
                                        i++;
                                        reqType += ' ' + row.RequestType;


                                    }
                                    else {
                                        i = 0;
                                        reqType = row.RequestType;

                                    }
                                    max = lenght;

                                }
                            }
                        }).catch(
                            (err) => {
                                throw new SQLException();
                            });
                    }
                    if (max != 0) {
                        if (i > 0) {
                            let split = [];
                            //select min avgTime from the elements of reqTime vector
                            split = reqType.split(' ');

                            let minAvgTime = Number.MAX_VALUE;
                            for (let row of split) {

                                await getAverageTime(row).then(avgTime => {

                                    if (avgTime < minAvgTime) {
                                        minAvgTime = avgTime;
                                        reqType = row;
                                    }
                                }).catch((err) => { throw new SQLException() });
                            }
                        }

                        selectMinTicket(reqType).then(minTicket => {
                            deleteQueueTicket(reqType, minTicket).then(returnValue => {
                                if (returnValue) {
                                    updateServed(counterID, reqType, minTicket).then(returnVal => {
                                        if (returnVal) {
                                            resolve([{ "counterID": counterID, "requestType": reqType, "ticketNumber": minTicket }])
                                        }

                                    }).catch(err => console.log(err))
                                }
                            }).catch((err) => { throw new SQLException(); })
                        }).catch((err) => {
                            throw new SQLException();
                        })
                    } else {
                        reqType = "Counter free";
                        let minTicket = 0;
                        const sql = 'UPDATE ServedTicket SET RequestType=?,TicketNumber=? WHERE CounterID=?';
                        db.run(sql, [reqType, minTicket, counterID], function (err) {
                            if (err)
                                reject(err);
                            else {
                                resolve([{ "counterID": counterID, "requestType": reqType, "ticketNumber": minTicket }]);
                            }
                        })
                    }
                }
            });

        });
    }


function countQueue(requestType){
    
        return new Promise((resolve, reject) => {
            const sql='SELECT COUNT(*) FROM Queue WHERE requestType=?';
        
            db.get(sql, [requestType], (err, row)=>{
                if(err)
                    reject(err);
                else {
                    console.log(row['COUNT(*)']);
                    resolve(row['COUNT(*)']);
                }
                    
            })
        })

    }

function selectMinTicket(requestType){
    console.log("reqtype selectmin:" + requestType);
        return new Promise((resolve, reject) => {
            const sql='SELECT MIN(QueueNumber) AS minTicket FROM Queue WHERE RequestType=? ';
            db.get(sql,[requestType], (err,row)=>{
                if(err)
                    reject(err);
                else{
                    console.log("minticket: " + row.minTicket);
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

function checkServed(counterID){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) FROM ServedTicket WHERE CounterID = ?';
        db.get(sql, [counterID], (err, row) =>{
            if(err) reject(err);
            else resolve(row['COUNT(*)']);
        })
    })
}

//insertServed and delete Served
function updateServed(counterID,requestType,ticketNumber){
        return new Promise((resolve, reject) => {

            checkServed(counterID)
            .then((count) => {
                if(count == 1){
                    const sql='UPDATE ServedTicket SET RequestType=?,TicketNumber=? WHERE CounterID=?';
                    db.run(sql,[requestType,ticketNumber,counterID],function(err){
                    if(err)
                        reject(err);
                    else{
                        resolve(true);
                    }})
                } else {
                    const sql='INSERT INTO ServedTicket VALUES(?,?,?)';
                    db.run(sql,[counterID,requestType,ticketNumber],function(err){
                    if(err)
                        reject(err);
                    else{
                        resolve(true);
                    }})
                }
            })
            
        })
}


function getAverageTime(requestType){
    return new Promise((resolve, reject) => {
        const sql='SELECT AverageTime FROM RequestType WHERE RequestType=?';
        db.get(sql,[requestType],(err,row)=>{
            if (err)
                reject(err)
            else{
                resolve(row.AverageTime);
            }
        })
    })
}
