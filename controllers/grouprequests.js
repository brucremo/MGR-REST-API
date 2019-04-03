const grouprequests = require('../db_apis/grouprequests.js');

//POST requests handling - CREATE
function getRelFromRec(req) {
    const relationship = {
        GROUPID: req.body.GROUPID,
        USERID: req.body.USERID,
        STATUS: req.body.STATUS
    };

    return relationship;
}

async function post(req, res, next) {
    try {

        let rel = getRelFromRec(req);

        rel.STATUS = 0;

        rel = await grouprequests.create(rel);

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
      let rel = getRelFromRec(req);
   
      rel = await grouprequests.update(rel);
   
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

  //DELETE requests handling - DELETE
async function del(req, res, next) {
    try {
   
      let rel = {
  
        USERID : req.query.USERID,
        GROUPID : req.query.GROUPID
      }
  
      const success = await grouprequests.delete(rel);
   
      if (success) {
        res.status(204).end();
      } else {
        res.status(409).end("ERROR");
      }
    } catch (err) {
      next(err);
    }
  }
   
  module.exports.del = del;