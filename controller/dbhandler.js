var db = require('../db')
db.connect();

module.exports.controller = function(app) {
    
    // TODO: put route in global file
    app.get('/datadb', function(req, res) {
        db.query('SELECT * FROM dbcorders', function(err, rows, fields) {
            if (err) throw err
            console.log(rows.length);
        })
        
        res.render('pages/datadb');
  });
}
