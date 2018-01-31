var db = require('../db')
db.connect();

module.exports.controller = function(app) {

  // TODO: put route in global file
  app.get('/datadb', function(req, res) {
    col = getColumnName(db);
    console.log(col);
    res.render('pages/datadb', {
      column: col
    })


  });
}

function getColumnName(db) {
  column = Array();
  column.name = Array();
  column.type = Array();
  // TODO: add aliases for user-friendly column_name
  db.query(
    "SELECT  COLUMN_NAME , COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = \'dbcorders\'",
    function(err, rows, fields) {
      if (err) throw err
      for (var key in rows) {
        column.push({
          'name': rows[key]['COLUMN_NAME'],
          'type': rows[key]['COLUMN_TYPE'],
        })
      }
    })
  return column;
}
