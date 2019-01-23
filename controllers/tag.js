const tag = require("../db_apis/tag.js");

//Add tag to game for a user
async function post(req, res, next) {
    try {

        var object = {
            USERID: req.body.USERID,
            GAMEID: req.body.GAMEID,
            TAGID: req.body.TAGID
        };

        var resultTag = await tag.create(object);

        res.status(201).json();
    } catch (err) {
        if (err.errorNum == 1) {

            res.status(501).end("TAG_EXISTS");
        } else {

            res.status(500).end(err.message);
        }
    }
}

module.exports.post = post;

//Get all games for a tag on the user's library
async function get(req, res, next) {

    if(!req.params.userid){
        
        res.status(404).end();
    }

    try {

        const context = {

            USERID: req.params.userid,
            TAGID: req.params.tagid
        };

        const rows = await tag.find(context);

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

        const success = await tag.delete(req.body.TAGID);

        if (success) {
            res.status(204).end("Tag Removed");
        } else {
            res.status(409).end("ERROR_PAIR_NONEXISTENT");
        }
    } catch (err) {
        next(err);
    }
}

module.exports.delete = del;