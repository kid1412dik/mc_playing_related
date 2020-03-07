// Use express module
const express = require('express');
const multipart = require('connect-multiparty');
const router = express.Router();

// Use SQL modules with our configs
const mysql = require('mysql');
const mysqlConfig = require('../../../db/sql/sqlConfigs');
const mysqlUserOp = require('../../../db/sql/userSqlOp');
const mysqlArticleOp = require('../../../db/sql/articleSqlOp');
const flags = require('../../__flags__');
const sqlOpSupport = require('./__sqlOpSupport__');

// Build a connection pool for sql connection
const mysqlPool = mysql.createPool(mysqlConfig.mysql);

const multipartMiddleware = multipart();
const flagCode = flags.flags();
const uuidv1 = require('uuid/v1');

router.get('/', (req, res, next) => {
  let sendData, sendStatus;

  sqlOpSupport.sendAndNotCloseConnection(res, sendData)
});

router.post('/', multipartMiddleware, (req, res, next) => {
  let routerInfo = [req, res, next];
  let blockUsers = 'NOT_LOGIN';
  let sendData, sendStatus;
  if (!sqlOpSupport.verifyLogin(routerInfo, blockUsers)) return;

  // Get connection from connection pool
  mysqlPool.getConnection(async (err, connection) => {
    try {
      sqlOpSupport.verifySQLConnectionError(routerInfo, err);

      let inputInfo = [
        article_id,
        title,
        author_id,
        content,
      ] = [
        uuidv1(),
        req.body.title,
        req.session.logInUser,
        req.body.content,
      ];
  
      let userData = await sqlOpSupport.getLoggedInUserData(routerInfo, connection);
  
      await new Promise ((resolve, reject) => {
        connection.query(mysqlArticleOp.insertNew, inputInfo, (error, results, fields) => {
          if (error) { sqlOpSupport.sendOnSQLConnectionError(routerInfo, error); reject(error); };
          resolve(results);
        })
      })
  
      connection.query(mysqlArticleOp.queryById, article_id, (error, results, fields) => {
        if (error) { sqlOpSupport.sendOnSQLConnectionError(routerInfo, error); return; };
        let createdArticle = results[0];
        sendData = {
          'article': {
            'article_id': createdArticle.article_id,
            'title': createdArticle.title,
            'created_at': createdArticle.created_at,
            'last_modified_at': createdArticle.last_modified_at,
            'author': userData,
            'content': createdArticle.content,
          },
        };
  
        sqlOpSupport.sendAndCloseConnection(res, sqlInfo, sendData);
      });
    } catch (error) { sqlOpSupport.deafultErrorRespond(routerInfo, sqlInfo, sendData, error) }
  });
});

router.put('/id', multipartMiddleware, (req, res, next) => {
  let routerInfo = [req, res, next];
  let blockUsers = 'NOT_LOGIN';
  let sendData, sendStatus;

  if (!sqlOpSupport.verifyLogin(routerInfo, blockUsers)) return;

  // Get connection from connection pool
  mysqlPool.getConnection(async (err, connection) => {
    let sqlInfo = [mysqlPool, connection];

    try {
      sqlOpSupport.verifySQLConnectionError(routerInfo, err);

      let inputInfo = [
        article_id,
        title,
        user_id,
        content,
      ] = [
        req.body.article_id,
        req.body.title,
        req.session.logInUser,
        req.body.content,
      ];
  
      let articleData = await sqlOpSupport.sureGetArticleDataById(routerInfo, mysqlPool, connection, article_id);

      let userData = await sqlOpSupport.getUserDataById([req, res, next], connection, articleData.author_id);
      userData = userData[0]

      // If the user is not the author of the article, reject operation
      if (userData.uuid !== user_id) {
        sendData = {
          'success': false,
          'flag': flagCode.ERROR_NOT_AUTHORIZED,
        }
        sqlOpSupport.sendAndCloseConnection(res, sqlInfo, sendData);
        throw new Error(sendData.flag)
      } 

      // Operate database, update value
      await new Promise ((resolve, reject) => {
        connection.query(mysqlArticleOp.updateById, [title, content, article_id], (error, results, fields) => {
          if (error) { sqlOpSupport.sendOnSQLConnectionError(routerInfo, error); reject(error); };
          resolve(results);
        });
      });

      // Obtain opertaion results
      articleData = await sqlOpSupport.getArticleDataById(routerInfo, connection, article_id);
      articleData = articleData[0];
      sendData = {
        'article': {
          'article_id': articleData.article_id,
          'title': articleData.title,
          'created_at': articleData.created_at,
          'last_modified_at': articleData.last_modified_at,
          'author': userData,
          'content': articleData.content,
        },
      };

      sqlOpSupport.sendAndCloseConnection(res, sqlInfo, sendData);
    } catch (error) { sqlOpSupport.deafultErrorRespond(routerInfo, sqlInfo, sendData, error) }
  });
});

router.patch('/id', multipartMiddleware, (req, res, next) => {
  let routerInfo = [req, res, next];
  let blockUsers = 'NOT_LOGIN';
  let sendData, sendStatus;
  if (!sqlOpSupport.verifyLogin(routerInfo, blockUsers)) return;

  // Get connection from connection pool
  mysqlPool.getConnection(async (err, connection) => {
    try {
      sqlOpSupport.verifySQLConnectionError(routerInfo, err);

      let inputInfo = [
        article_id,
        title,
        user_id,
        content,
      ] = [
        req.body.article_id,
        req.body.title,
        req.session.logInUser,
        req.body.content,
      ];
  
      let articleData = await sqlOpSupport.getArticleDataById(routerInfo, connection, article_id);
      articleData = articleData[0];
  
      // If the given article id is not existed, reject operation
      if (articleData === undefined) {
        sendData = {
          'success': false,
          'flag': flagCode.ERROR_ARTICLE_NOT_FOUND,
        }
        sqlOpSupport.sendAndCloseConnection(res, sqlInfo, sendData);
        throw new Error(sendData.flag)
      }

      let userData = await sqlOpSupport.getUserDataById([req, res, next], connection, articleData.author_id);
      userData = userData[0]

      // If the user is not the author of the article, reject operation
      if (userData.uuid !== user_id) {
        sendData = {
          'success': false,
          'flag': flagCode.ERROR_NOT_AUTHORIZED,
        }
        sqlOpSupport.sendAndCloseConnection(res, sqlInfo, sendData);
        throw new Error(sendData.flag)
      } 

      // We are going to update data partially, if the data is not given, we
      // should use the previous data
      if (!title) title = articleData.title;
      if (!content) content = articleData.content;

      // Operate database, update value
      await new Promise ((resolve, reject) => {
        connection.query(mysqlArticleOp.updateById, [title, content, article_id], (error, results, fields) => {
          if (error) { sqlOpSupport.sendOnSQLConnectionError(routerInfo, error); reject(error); };
          resolve(results);
        });
      });

      // Obtain opertaion results
      articleData = await sqlOpSupport.getArticleDataById(routerInfo, connection, article_id);
      articleData = articleData[0];
      sendData = {
        'article': {
          'article_id': articleData.article_id,
          'title': articleData.title,
          'created_at': articleData.created_at,
          'last_modified_at': articleData.last_modified_at,
          'author': userData,
          'content': articleData.content,
        },
      };

      sqlOpSupport.sendAndCloseConnection(res, sqlInfo, sendData);
    } catch (error) { sqlOpSupport.deafultErrorRespond(routerInfo, sqlInfo, sendData, error) }
  });
});

router.delete('/id', multipartMiddleware, (req, res, next) => {
  let routerInfo = [req, res, next];
  let blockUsers = 'NOT_LOGIN';
  let sendData, sendStatus;
  if (!sqlOpSupport.verifyLogin(routerInfo, blockUsers)) return;

  // Get connection from connection pool
  mysqlPool.getConnection(async (err, connection) => {
    try {
      sqlOpSupport.verifySQLConnectionError(routerInfo, err);

      let inputInfo = [
        article_id,
        user_id,
      ] = [
        req.body.article_id,
        req.session.logInUser,
      ];

      let articleData = await sqlOpSupport.getArticleDataById(routerInfo, connection, article_id);
      articleData = articleData[0];
  
      // If the given article id is not existed, reject operation
      if (articleData === undefined) {
        sendData = {
          'success': false,
          'flag': flagCode.ERROR_ARTICLE_NOT_FOUND,
        }
        sqlOpSupport.sendAndCloseConnection(res, sqlInfo, sendData);
        throw new Error(sendData.flag)
      }

      // Delete the article in database
      await new Promise ((resolve, reject) => {
        connection.query(mysqlArticleOp.deleteById, [article_id], (error, results, fields) => {
          if (error) { sqlOpSupport.sendOnSQLConnectionError(routerInfo, error); reject(error); };
          resolve(results);
        });
      });

      // Verify the operation
      articleData = await sqlOpSupport.getArticleDataById(routerInfo, connection, article_id);
      articleData = articleData[0];

      if (articleData === undefined) {
        sendData = {
          'success': true,
        }
        sqlOpSupport.sendAndCloseConnection(res, sqlInfo, sendData);
      } else {
        sendData = {
          'success': false,
          'flag': flagCode.ERROR_UNKNOWN_SQL_CONNECTION_ERROR,
        }
  
        sqlOpSupport.sendAndCloseConnection(res, sqlInfo, sendData);
        throw new Error(sendData.flag)
      }
    } catch (error) { sqlOpSupport.deafultErrorRespond(routerInfo, sqlInfo, sendData, error) }
  });
});

module.exports = router;
