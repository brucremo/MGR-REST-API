const posts = require('../db_apis/post.js');

//GET requests handling - RETRIEVE - OK
async function get(req, res, next) {
    try {

        var baseQuery =
            `select *
    from POST
    where POST_ID = :POST_ID
    and THREAD_ID = :THREAD_ID`;

        const context = {
            THREAD_ID: req.query.THREAD_ID,
            POST_ID: req.query.POST_ID
        };

        if(context.POST_ID == undefined){

            delete context.POST_ID;
            
            baseQuery =
            `select *
            from POST
            where THREAD_ID = :THREAD_ID`;
        }

        const rows = await posts.find(context, baseQuery);

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
            POST_CONTENT: req.body.POST_CONTENT,
            STATUS: req.body.STATUS,
            CREATED_BY: req.body.CREATED_BY,
            THREAD_ID: req.body.THREAD_ID
        };

        rel = await posts.create(info);

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
            POST_ID: req.body.POST_ID,
            POST_CONTENT: req.body.POST_CONTENT,
            THREAD_ID: req.body.THREAD_ID
        };

        var query = `update POST 
    set POST_CONTENT = :POST_CONTENT
    where POST_ID = :POST_ID
    and THREAD_ID = :THREAD_ID`;

        rel = await posts.update(info, query);

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
            POST_ID: req.body.POST_ID,
            STATUS: req.body.STATUS,
            THREAD_ID: req.body.THREAD_ID
        };

        var query = `update POST 
      set STATUS = :STATUS
      where POST_ID = :POST_ID
      and THREAD_ID = :THREAD_ID`;

        rel = await posts.update(info, query);

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
            POST_ID: req.query.POST_ID,
            THREAD_ID: req.query.THREAD_ID
        }

        const success = await posts.delete(rel);

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