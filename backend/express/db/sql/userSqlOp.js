const UserSQL = {  
  insert:'INSERT INTO User(uuid,userName,pwd,userEmail,userBio) VALUES(?,?,?,?,?)', 
  insertSimplfied:'INSERT INTO User(uuid,userName,userPwd,userEmail) VALUES(?,?,?,?)', 
  queryAll:'SELECT uuid,userName,userBio,userLevel FROM User',  
  getUserById:'SELECT uuid,userName,userBio,userLevel FROM User WHERE uuid = ? ',
  getUserByName:'SELECT uuid,userName,userBio,userLevel FROM User WHERE userName = ? ',
  getUserByNameWithPassword: 'SELECT * FROM User WHERE userName = ? ',
  queryAllNormal: 'SELECT uuid,userName FROM User',
  getUserByIdNormal:'SELECT uuid,userName FROM User WHERE uuid = ? ',
};

module.exports = UserSQL;