module.exports.controller = function(app) {
    
    // TODO: put route in global file
    app.get('/datadb', function(req, res) {
        res.render('pages/datadb');
  });
}
