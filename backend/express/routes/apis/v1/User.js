// Use express module
const express = require('express');
const multipart = require('connect-multiparty');
const router = express.Router();

// Use SQL modules with our configs
const mysql = require('mysql');
const mysqlConfig = require('../../../db/sql/sqlConfigs');
const mysqlUserOp = require('../../../db/sql/userSqlOp');
const flags = require('../../__flags__');
const sqlOpSupport = require('./__sqlOpSupport__');

// Build a connection pool for sql connection
const mysqlPool = mysql.createPool(mysqlConfig.mysql);

const multipartMiddleware = multipart();
const flagCode = flags.flags();

// User login
// DO NOT use 'get' here. Use 'post' to secure user's password.
router.post('/login', multipartMiddleware, async (req, res, next) => {
  let routerInfo = [req, res, next];
  let blockUsers = 'LOGIN';
  if (!sqlOpSupport.verifyLogin(routerInfo, blockUsers)) return;

  // Get connection from connection pool
  mysqlPool.getConnection(async (err, connection) => {
    try {
      await sqlOpSupport.verifySQLConnectionError(routerInfo, err);

      let [
        userName,
        userPwd,
      ] = [
          req.body.userName,
          req.body.userPwd,
      ];
  
      connection.query(mysqlUserOp.getUserByNameWithPassword, [userName], (error, results, fields) => {
        if (error) { sqlOpSupport.sendOnSQLConnectionError(routerInfo, error); return; };
        
        if (results.length === 0) { // TODO: improve here!
          res.status(401);
          res.send({
            'success': false,
            'flag': flagCode.ERROR_USER_NOT_FOUND
          });
          return;
        }
  
        results = results[0]
        let sendData;
  
        if (results.userName == userName && results.userPwd == userPwd) {
          req.session.logIn = true;
          req.session.logInUser = results.uuid;
  
          sendData = {
            'success': true,
            'flag': flagCode.INFO_USER_LOGIN_SUCCEEDED,
            'userData': results,
          };
        } else {
          res.status(401);
          if (results.userName != userName) {
            sendData = {
              'success': false,
              'flag': flagCode.ERROR_USER_NAME_WRONG
            };
          } else if (results.userPwd != userPwd) {
            sendData = {
              'success': false,
              'flag': flagCode.ERROR_USER_PASSWORD_WRONG
            };
          } else {
            sendData = {
              'success': false,
              'flag': flagCode.ERROR_USER_PASSWORD_WRONG
            };
          }
        }
        sqlOpSupport.sendAndCloseConnection(res, mysqlPool, connection, sendData);
      });
    } catch (error) {
      console.log(error);
    }
  });
});

module.exports = router;
