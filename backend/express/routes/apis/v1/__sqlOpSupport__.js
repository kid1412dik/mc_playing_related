const flags = require('../../__flags__');
const flagCode = flags.flags();

const mysqlUserOp = require('../../../db/sql/userSqlOp');
const mysqlArticleOp = require('../../../db/sql/articleSqlOp');

function sendAndCloseConnection(res, [mysqlPool, connection], data) {
  res.send(data);

  // Release the connection
  // connection.release(); // might not work
  mysqlPool.releaseConnection(connection);
}

function sendAndNotCloseConnection(res, data, status) {
  res.status(status);
  res.send(data);
}

function deafultErrorRespond([req, res, next], [mysqlPool, connection], sendData, error) {
  console.log(error);
  if (!sendData) {
    sendData = {
      'success': false,
      'flag': flagCode.ERROR_UNSET_SERVER_INTERNAL_WRONG,
      'error': error,
    }
  }
  sendAndNotCloseConnection(res, sendData);
}

function verifyLogin([req, res, next], blockFlag) {
  let checkMode = (blockFlag.toUpperCase() === 'LOGIN') ? true : false;

  if (checkMode) {
    if (req.session.logIn) {
      res.status(400);
      res.send({
        'success': false,
        'flag': flagCode.ERROR_ALREADY_LOGGED_IN,
      });
      console.log('Warning: User has already logged in');
      return false;
    }
  } else {
    if (!(req.session.logIn)) {
      res.status(401);
      res.send({
        'success': false,
        'flag': flagCode.ERROR_NOT_LOGGED_IN,
      });
      console.log('Warning: User not logged in');
      return false;
    }
  }
  return true;
}

function verifySQLConnectionError([req, res, next], error) {
  if (error) {
    sendOnSQLConnectionError([req, res, next], error);

    return new Promise((resolve, reject) => {
      reject(error);
    });
  }
}

function sendOnSQLConnectionError(sendData, sendStatus, error) {
  if (error) {
    sendStatus = 500;
    sendData = {
      'success': false,
      'flag': flagCode.ERROR_UNKNOWN_SQL_CONNECTION_ERROR,
      'error': {
        'code': error.code,
        'sqlMessage': error.sqlMessage,
      },
    };
  }
}

function getLoggedInUserData([req, res, next], connection) {
  return getUserDataById([req, res, next], connection, req.session.logInUser);
}

function getUserDataById([req, res, next], connection, userId) {
  return new Promise((resolve, reject) => {
    connection.query(mysqlUserOp.getUserById, [userId], (error, results, fields) => {
      if (error) { sendOnSQLConnectionError([req, res, next], error); reject(error); };
      resolve(results);
    });
  })
}

function getArticlesDataById([req, res, next], connection, articleIds) {
  return new Promise((resolve, reject) => {
    connection.query(mysqlArticleOp.queryById, articleIds, (error, results, fields) => {
      if (error) { sendOnSQLConnectionError([req, res, next], error); reject(error); };
      resolve(results);
    });
  })
}

function getArticleDataById([req, res, next], connection, articleId) {
  return getArticlesDataById([req, res, next], connection, [articleId]);
}

async function sureGetArticlesDataById([req, res, next], mysqlPool, connection, articleIds){
  let articlesData = await getArticlesDataById([req, res, next], connection, articleIds);

  // If the given article id is not existed, reject operation
  if (articlesData.length === 0) {
    let sendData = {
      'success': false,
      'flag': flagCode.ERROR_ARTICLE_NOT_FOUND,
    }
    sendAndCloseConnection(res, mysqlPool, connection, sendData);
    throw new Error(sendData.flag)
  } else {
    return articlesData;
  }
}

async function sureGetArticleDataById([req, res, next], mysqlPool, connection, articleId){
  let articleData = await sureGetArticlesDataById([req, res, next], mysqlPool, connection, [articleId]);
  return articleData[0];
}

module.exports = {
  sendAndCloseConnection,
  sendAndNotCloseConnection,
  deafultErrorRespond,

  verifyLogin,
  verifySQLConnectionError,

  sendOnSQLConnectionError,

  getLoggedInUserData,
  getUserDataById,
  getArticlesDataById,
  getArticleDataById,

  sureGetArticlesDataById,
  sureGetArticleDataById,
};