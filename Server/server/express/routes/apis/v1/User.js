// Use express module
let express = require('express');
let multipart = require('connect-multiparty');
let router = express.Router();

// Use SQL modules with our configs
let mysql = require('mysql');
let mysqlConfig = require('../../../db/sql/sqlConfigs');
let mysqlUserOp = require('../../../db/sql/userSqlOp');
let flags = require('../../__flags__');
let supportCommunicationMethods = require('./__communicationSupport__');

let multipartMiddleware = multipart();
let flagCode = flags.flags();

// Build a connection pool for sql connection
let mysqlPool = mysql.createPool(mysqlConfig.mysql);


// User login
// DO NOT use 'get' here. Use 'post' to secure user's password.
router.post('/login', multipartMiddleware, (req, res, next) => {
  if (!supportCommunicationMethods.checkLogin('Login', req, res, next)) return;

  // Get connection from connection pool
  mysqlPool.getConnection((err, connection) => {
    if (!supportCommunicationMethods.checkSQLConnection(err, mysqlPool, connection, flagCode.ERROR_UNKNOWN_SQL_CONNECTION_ERROR)) return;

    let [
      userName,
      userPwd,
    ] = [
        req.body.userName,
        req.body.userPwd,
      ];

    connection.query(mysqlUserOp.getUserByName, [userName], (error, results, fields) => {
      if (!supportCommunicationMethods.checkSQLConnection(error, mysqlPool, connection, flagCode.ERROR_UNKNOWN_USER_LOGIN_ERROR)) return;
      
      if (results.length === 0) { // TODO: improve here!
        res.status(401);
        res.send({
          'success': false,
          'flag': flagCode.ERROR_USER_NOT_FOUND
        });
        return;
      }

      results = results[0]
      let sentData;

      if (results.userName == userName && results.userPwd == userPwd) {
        req.session.logIn = true;
        req.session.logInUser = results.uuid;

        sentData = {
          'success': true,
          'flag': flagCode.INFO_USER_LOGIN_SUCCEEDED,
          'userData': results,
        };
      } else {
        res.status(401);
        if (results.userName != userName) {
          sentData = {
            'success': false,
            'flag': flagCode.ERROR_USER_NAME_WRONG
          };
        } else if (results.userPwd != userPwd) {
          sentData = {
            'success': false,
            'flag': flagCode.ERROR_USER_PASSWORD_WRONG
          };
        } else {
          sentData = {
            'success': false,
            'flag': flagCode.ERROR_USER_PASSWORD_WRONG
          };
        }
      }

      supportCommunicationMethods.sendAndCloseConnection(res, mysqlPool, connection, sentData);
    });
  });
});


// User register
// DO NOT use 'get' here. Use 'post' to secure user's password.
router.post('/register', multipartMiddleware, (req, res, next) => {
  if (!supportCommunicationMethods.checkLogin('Login', req, res, next)) return;

  // Get connection from connection pool
  mysqlPool.getConnection((err, connection) => {
    if (!supportCommunicationMethods.checkSQLConnection(err, mysqlPool, connection, flagCode.ERROR_UNKNOWN_USER_LOGIN_ERROR)) return;

    let [
      uuid,
      userName,
      userPwd,
      userEmail,
    ] = [
        parseInt(req.body.uuid),
        req.body.userName,
        req.body.userPwd,
        req.body.userEmail,
      ];

    connection.query(mysqlUserOp.insertSimplfied, [uuid, userName, userPwd, userEmail], (error, results, fields) => {
      if (!supportCommunicationMethods.checkSQLConnection(error, mysqlPool, connection, flagCode.ERROR_UNKNOWN_USER_LOGIN_ERROR)) return;

      res.send({
        'success': true,
        'flag': flagCode.INFO_USER_REGISTER_SUCCEEDED,
      });
      // Release the connection
      // connection.release(); // might not work
      mysqlPool.releaseConnection(connection);
    });
  });
});


router.post('/getUserById', multipartMiddleware, (req, res, next) => {
  if (!supportCommunicationMethods.checkLogin('NotLogin', req, res, next)) return;

  let uuid = parseInt(req.body.uuid);

  mysqlPool.getConnection((err, connection) => {
    if (!supportCommunicationMethods.checkSQLConnection(err, mysqlPool, connection, flagCode.ERROR_UNKNOWN_SQL_CONNECTION_ERROR)) return;

    connection.query(mysqlUserOp.getUserByIdNormal, [uuid], (error, results, fields) => {
      if (!supportCommunicationMethods.checkSQLConnection(error, mysqlPool, connection, flagCode.ERROR_UNKNOWN_SQL_CONNECTION_ERROR)) return;

      res.send({
        'success': true,
        'userData': results,
      });
    });
    mysqlPool.releaseConnection(connection);
  });
});


router.post('/listUsers', multipartMiddleware, (req, res, next) => {
  if (!supportCommunicationMethods.checkLogin('NotLogin', req, res, next)) return;

  mysqlPool.getConnection((err, connection) => {
    if (!supportCommunicationMethods.checkSQLConnection(err, mysqlPool, connection, flagCode.ERROR_UNKNOWN_SQL_CONNECTION_ERROR)) return;

    connection.query(mysqlUserOp.queryAllNormal, (error, results, fields) => {
      if (!supportCommunicationMethods.checkSQLConnection(error, mysqlPool, connection, flagCode.ERROR_UNKNOWN_SQL_CONNECTION_ERROR)) return;

      res.send({
        'success': true,
        'userData': results,
      });
    });
    mysqlPool.releaseConnection(connection);
  });
});


router.post('/getUserDetailsById', multipartMiddleware, (req, res, next) => {
  if (!supportCommunicationMethods.checkLogin('NotLogin', req, res, next)) return;

  mysqlPool.getConnection((err, connection) => {
    if (!supportCommunicationMethods.checkSQLConnection(err, mysqlPool, connection, flagCode.ERROR_UNKNOWN_SQL_CONNECTION_ERROR)) return;

    let userData;
    connection.query(mysqlUserOp.getUserById, uuid, (error, results, fields) => {
      if (!supportCommunicationMethods.checkSQLConnection(error, mysqlPool, connection, flagCode.ERROR_UNKNOWN_SQL_CONNECTION_ERROR)) return;

      // userData = results
    });
    mysqlPool.releaseConnection(connection);

    connection.query(mysqlUserOp.getUserByIdNormal, uuid, (error, results, fields) => {
      if (!supportCommunicationMethods.checkSQLConnection(error, mysqlPool, connection, flagCode.ERROR_UNKNOWN_SQL_CONNECTION_ERROR)) return;

      res.send({
        'success': true,
        'userData': results,
      });
    });
    mysqlPool.releaseConnection(connection);
  });
});


router.post('/listUsersDetails', multipartMiddleware, (req, res, next) => {
  if (!supportCommunicationMethods.checkLogin('NotLogin', req, res, next)) return;

  mysqlPool.getConnection((err, connection) => {
    if (!supportCommunicationMethods.checkSQLConnection(err, mysqlPool, connection, flagCode.ERROR_UNKNOWN_SQL_CONNECTION_ERROR)) return;

    connection.query(mysqlUserOp.getUserByIdNormal, uuid, (error, results, fields) => {
      if (!supportCommunicationMethods.checkSQLConnection(error, mysqlPool, connection, flagCode.ERROR_UNKNOWN_SQL_CONNECTION_ERROR)) return;

      res.send({
        'success': true,
        'userData': results,
      });
    });
    mysqlPool.releaseConnection(connection);
  });
});




module.exports = router;
