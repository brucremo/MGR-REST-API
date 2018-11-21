const reviews = require("../db_apis/reviews.js");

//POST requests handling
async function post(req, res, next) {
    try {

        var object = {
            USERID: req.params.userid,
            GAMEID: req.params.gameid,
            REVIEWSUMMARY: req.body.REVIEWSUMMARY,
            REVIEWRATING: req.body.REVIEWRATING
        };

        object = await reviews.create(object);

        res.status(201).end();
    } catch (err) {

        res.status(500).end(err.message);
    }
}

module.exports.post = post;

//GET requests handling - RETRIEVE - OK
async function get(req, res, next) {
    try {

        const context = {};

        context.id = req.params.gameid;

        const rows = await reviews.find(context);

        if (req.params.userid) {
            if (rows.length >= 0) {
                res.status(200).json(rows);
            } else {
                res.status(404).end();
            }
        } else {
            res.status(200).json(rows);
        }
    } catch (err) {
        next(err);
    }
}

module.exports.get = get;

//DELETE requests handling - DELETE
async function del(req, res, next) {
    try {

        const success = await reviews.delete(req.params.userid, req.params.gameid);

        if (success) {
            res.status(204).end();
        } else {
            res.status(409).end("ERROR_PAIR_NONEXISTENT");
        }
    } catch (err) {
        next(err);
    }
}

module.exports.delete = del;