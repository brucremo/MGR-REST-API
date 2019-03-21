const group = require('../db_apis/group.js');

//GET requests handling - RETRIEVE - OK
async function get(req, res, next) {
  try {

    const baseQuery =
    `select *
    from GROUPS
    where GROUPID = :GROUPID`;

    const context = {
        GROUPID: req.query.GROUPID
    };
 
    const rows = await group.find(context, baseQuery);
 
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

//GET requests handling - RETRIEVE - OK
async function getGroupsUser(req, res, next) {
  try {

    const context = {
        USERID: req.query.USERID
    };
 
    const rows = await group.findGroupsUser(context);
 
    if (rows) {
        res.status(200).json(rows);
    } else {
        res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}
 
module.exports.getGroupsUser = getGroupsUser;

//POST requests handling - CREATE
function getRelFromRec(req) {
  const info = {
    GROUPID: req.body.GROUPID,
    GROUPPRIVACY: req.body.GROUPPRIVACY,
    GROUPSUMMARY: req.body.GROUPSUMMARY,
    GROUPOWNER: req.body.GROUPOWNER,
    GROUPNAME: req.body.GROUPNAME
  };
 
  return info;
}
 
async function post(req, res, next) {
  try {

    let rel = getRelFromRec(req);
    delete rel.GROUPID;
    rel = await group.create(rel);
 
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
    
    var query = `update GROUPS 
    set GROUPNAME = :GROUPNAME,
    GROUPOWNER = :GROUPOWNER,
    GROUPPRIVACY = :GROUPPRIVACY,
    GROUPSUMMARY = :GROUPSUMMARY
    where GROUPID = :GROUPID`;
 
    rel = await group.update(rel, query);
 
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

      GROUPID : req.body.GROUPID
    }

    const success = await group.delete(rel);
 
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