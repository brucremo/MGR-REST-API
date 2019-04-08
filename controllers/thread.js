const thread = require('../db_apis/thread.js');

//GET requests handling - RETRIEVE - OK
async function get(req, res, next) {
    try {

        const baseQuery =
            `select *
    from THREAD
    where THREAD_ID = :THREAD_ID
    and GROUPID = :GROUPID`;

        const context = {
            THREAD_ID: req.query.THREAD_ID,
            GROUPID: req.query.GROUPID
        };

        const rows = await thread.find(context, baseQuery);

        if (rows.length >= 1) {
            res.status(200).json(rows);
        } else {
            res.status(404).end();
        }
    } catch (err) {
        next(err);
    }
}

module.exports.get = get;

//POST requests handling - CREATE
async function post(req, res, next) {
    try {

        const info = {
            THREAD_SUBJECT: req.body.THREAD_SUBJECT,
            THREAD_TITLE: req.body.THREAD_TITLE,
            STATUS: req.body.STATUS,
            CREATED_BY: req.body.CREATED_BY,
            GROUPID: req.body.GROUPID
        };

        rel = await thread.create(info);

        res.status(201).json();
    } catch (err) {
        if (err.errorNum == 1) {

            res.status(501).end("ERROR");
        } else {

            res.status(500).end(err.message);
        }
    }
}

module.exports.post = post;

//PUT requests handling - UPDATE - OK
async function put(req, res, next) {
    try {
        const info = {
            THREAD_ID: req.body.THREAD_ID,
            THREAD_SUBJECT: req.body.THREAD_SUBJECT,
            THREAD_TITLE: req.body.THREAD_TITLE,
            GROUPID: req.body.GROUPID
        };

        var query = `update THREAD 
    set THREAD_TITLE = :THREAD_TITLE,
    THREAD_SUBJECT = :THREAD_SUBJECT
    where THREAD_ID = :THREAD_ID
    and GROUPID = :GROUPID`;

        rel = await thread.update(info, query);

        if (rel.rowsAffected !== 0) {
            res.status(200).json();
        } else {
            res.status(404).end("UPDATE_ERROR");
        }
    } catch (err) {
        next(err);
    }
}

module.exports.put = put;

//PUT requests handling - UPDATE - OK
async function putStatus(req, res, next) {
    try {

        const info = {
            THREAD_ID: req.body.THREAD_ID,
            STATUS: req.body.STATUS,
            GROUPID: req.body.GROUPID
        };

        var query = `update THREAD 
      set STATUS = :STATUS
      where THREAD_ID = :THREAD_ID
      and GROUPID = :GROUPID`;

        rel = await thread.update(info, query);

        if (rel.rowsAffected !== 0) {
            res.status(200).json();
        } else {
            res.status(404).end("UPDATE_ERROR");
        }
    } catch (err) {
        next(err);
    }
}

module.exports.putStatus = putStatus;

//DELETE requests handling - DELETE
async function del(req, res, next) {
    try {

        let rel = {
            THREAD_ID: req.query.THREAD_ID,
            GROUPID: req.query.GROUPID
        }

        const success = await thread.delete(rel);

        if (success) {
            res.status(204).end();
        } else {
            res.status(409).end("ERROR");
        }
    } catch (err) {
        next(err);
    }
}

module.exports.delete = del;