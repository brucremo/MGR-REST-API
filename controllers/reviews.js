const reviews = require("../db_apis/reviews.js");

//POST requests handling
async function post(req, res, next) {
    try {

        var object = {
            USERID: req.params.userid,
            GAMEID: req.params.gameid,
            REVIEWSUMMARY: req.body.REVIEWSUMMARY,
            REVIEWRATING: req.body.REVIEWRATING,
            GAMETIME: req.body.GAMETIME,
            GAMEPLATFORM: req.body.GAMEPLATFORM
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

//GET requests handling - RETRIEVE - OK
async function getUser(req, res, next) {
    try {

        const context = {};

        context.id = req.params.userid;

        const rows = await reviews.findUser(context);

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

module.exports.getUser = getUser;

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

//PUT requests handling - UPDATE - OK

function getReviewFromReq(req) {

    const object = {
        USERID: req.params.userid,
        GAMEID: req.params.gameid,
        REVIEWSUMMARY: req.body.REVIEWSUMMARY,
        REVIEWRATING: req.body.REVIEWRATING,
        //GAMETIME: req.body.GAMETIME,
        GAMEPLATFORM: req.body.GAMEPLATFORM
    };
   
    return object;
  }
  async function put(req, res, next) {
    try {
      let user = getReviewFromReq(req);
   
      user = await reviews.update(user);
   
      if (user.rowsAffected !== 0) {
        res.status(200).json();
      } else {
        res.status(500).end("UPDATE_ERROR");
      }
    } catch (err) {
      next(err);
    }
  }
   
  module.exports.put = put;

  //GET requests handling - RETRIEVE - OK
async function getOne(req, res, next) {
    try {

        const context = {};

        context.id = req.params.userid;
        context.gameid = req.params.gameid;

        const rows = await reviews.findReview(context);

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

module.exports.getOne = getOne;