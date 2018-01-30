module.exports.controller = function(app) {

/**
 * a home page route
 */
app.get('/data', function(req, res) {
    // any logic goes here
    res.render('data')
});

}
