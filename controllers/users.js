const users = require('../db_apis/users.js');
 
//GET requests handling
async function get(req, res, next) {
  try {
    const context = {};
 
    context.id = parseInt(req.params.id, 10);
 
    const rows = await users.find(context);
 
    if (req.params.id) {
      if (rows.length === 1) {
        res.status(200).json(rows[0]);
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

//POST requests handling
function getUserFromRec(req) {
  const user = {
    USERID: req.body.USERID,
    USERPASSWORD: req.body.USERPASSWORD,
    USERNAME: req.body.USERNAME,
    USERSUMMARY: req.body.USERSUMMARY,
    USERJOINDATE: req.body.USERJOINDATE,
    USERAVATAR: req.body.USERAVATAR,
    USERLOCATION: req.body.USERLOCATION
  };
 
  return user;
}
 
async function post(req, res, next) {
  try {
    let user = getUserFromRec(req);
 
    employee = await users.create(user);
 
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}
 
module.exports.post = post;