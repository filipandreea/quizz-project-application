const express = require('express')
const router = express.Router()
const sql = require("../db.js");
const table = "quizz_answers";

//get's the whole table
//not used for the moment
// getUser = (req, res) => {
//     sql.query({sql: "SELECT * FROM " + table + " WHERE 1 "}, (qErr, qResult, fields) => {
//         if(qErr) {
//             console.log("error: ", qErr);
//             res.send({
//                 result: qErr,
//                 status: 500
//             });
//         }
//         else {
//             // console.log(qResult.insertId);
//             res.send({
//                 result: qResult,
//                 status: 200
//             });
//         }
//     });
// }

//functions for posting the user data in the database
postUser = (req, res) => {

    const request = req.body;

    if (!request.user || !request.score)
        res.send({ error: "value may be undefined", req: request });

    const user = request.user;
    const score = request.score;

    sql.query({
        sql: "INSERT INTO " + table + "(user, score) VALUES (?, ?)",
        values: [user, score]
    }, (qErr, qResult, fields) => {
        if (qErr) {
            console.log("error: ", qErr);
            res.send({
                result: qErr,
                status: 500 //500-access denied
            });
        } else {
            console.log(qResult.insertId);
            res.send({
                result: qResult,
                status: 200 //200-success
            });
        }
    });
}

//routes to functions that manipulate the database
router.post('/', postUser)

module.exports = router