const ArticleSqlOp = {  
  queryAll:'SELECT * FROM Article',
  insertNew:'INSERT INTO Article(article_id,title,created_at,last_modified_at,author_id,content) VALUES(?,?,NOW(),NOW(),?,?)',
  queryById:'SELECT * FROM Article WHERE article_id = ?',
  updateById:'UPDATE Article SET title=?,last_modified_at=NOW(),content=? WHERE article_id = ?',
  deleteById:'DELETE FROM Article WHERE article_id = ?',
};

module.exports = ArticleSqlOp;