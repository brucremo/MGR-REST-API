const relationship = require('../db_apis/relationship.js');

//GET requests handling - RETRIEVE - OK
async function get(req, res, next) {
  try {

    const context = {
        USERID: req.body.USER_ONE_ID
    };
 
    const rows = await relationship.find(context);
 
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
function getRelFromRec(req) {
  const relationship = {
    USER_ONE_ID: req.body.USER_ONE_ID,
    USER_TWO_ID: req.body.USER_TWO_ID,
    STATUS: req.body.STATUS,
    ACTION_USERID: req.body.ACTION_USERID
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
    if(err.errorNum == 1){

      res.status(501).end("ERROR");
    }else{

      res.status(500).end(err.message);
    }
  }
}
 
module.exports.post = post;

//PUT requests handling - UPDATE - OK
async function put(req, res, next) {
  try {
    let rel = getRelFromRec(req);
 
    rel = await relationship.update(rel);
 
    if (user.rowsAffected !== 0) {
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
 
    let rel = getRelFromRec(req);
    delete rel.STATUS;
    delete rel.ACTION_USERID;

    const success = await relationship.delete(rel);
 
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