const grouprequests = require('../db_apis/grouprequests.js');

//POST requests handling - CREATE
function getRelFromRec(req) {
    const relationship = {
        GROUPID: req.body.USER_ONE_ID,
        USERID: req.body.USER_TWO_ID,
        STATUS: req.body.STATUS
    };

    return relationship;
}

async function post(req, res, next) {
    try {

        let rel = getRelFromRec(req);

        rel.STATUS = 0;

        rel = await relationship.create(rel);

        res.status(201).json();
    } catch (err) {
        if (err.errorNum == 1) {

            res.status(501).end("ERROR");
        } else {

            res.status(500).end(err.message);
        }
    }
}