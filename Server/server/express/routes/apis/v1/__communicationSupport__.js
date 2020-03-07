let flags = require('../../__flags__');
let flagCode = flags.flags();

module.exports = {
  /**
   * 
   * @param {String} blockFlag 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  checkLogin(blockFlag, req, res, next) {
    let checkMode = (blockFlag.toLowerCase() === 'login') ? true : false;

    if (checkMode) {
      if (req.session.logIn) {
        res.status(400);
        res.send({
          'success': false,
          'flag': flagCode.ERROR_ALREADY_LOGGED_IN,
        });
        return false;
      }
    } else {
      if (!(req.session.logIn)) {
        res.status(400);
        res.send({
          'success': false,
          'flag': flagCode.ERROR_NOT_LOGGED_IN,
        });
        return false;
      }
    }

    return true;
  },

  checkSQLConnection(error, mysqlPool, connection, flag) {
    if (error) {
      console.log(error);
      res.status(500);
      res.send({
        'success': false,
        'flag': flag,
        'error': error,
      });
      mysqlPool.releaseConnection(connection);
      return false;
    } else {
      return true;
    }
  },

  sendAndCloseConnection(res, mysqlPool, connection, data) {
    res.send(data);

    // Release the connection
    // connection.release(); // might not work
    mysqlPool.releaseConnection(connection);
  },

};