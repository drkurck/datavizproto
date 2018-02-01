var db = require('../db')
db.connect();

module.exports.controller = function(app) {
    
    // TODO: put route in global file
    app.get('/datadb', function(req, res) {
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
                res.render('pages/datadb', {
                    column: column
                })
            })
        });
        
        app.post('/datadb', function(req, res) {
            var request = '';
            if (req.body.operation === 'none') {
                request = "SELECT "+req.body.arg1+" AS elmt1, "+req.body.arg2+ " AS elmt2 FROM dbcorders GROUP BY "+ req.body.arg2
            } else {
                if (req.body.arg2 == 'created') {
                    request = "SELECT "+ req.body.operation +"("+req.body.arg1+") AS elmt1, DATE_FORMAT("+req.body.arg2+", \"%d %M %Y\") AS elmt2 FROM dbcorders GROUP BY DATE_FORMAT("+req.body.arg2+", \"%d %M %Y\")"
                } else {
                    request = "SELECT "+ req.body.operation +"("+req.body.arg1+") AS elmt1, "+req.body.arg2+ " AS elmt2 FROM dbcorders GROUP BY "+ req.body.arg2
                }
                
            }
            console.log(request);
            var data = new Array();
            var label = new Array();
            var colors = new Array();
            // TODO: add aliases for user-friendly column_name
            db.query(
                request,
                function(err, rows, fields) {
                    if (err) throw err
                    for (var key in rows) {
                        if (rows[key]['elmt2'] != null) {
                            label.push(rows[key]['elmt2']);
                            data.push(rows[key]['elmt1']);
                            colors.push('#'+(Math.random()*0xFFFFFF<<0).toString(16));
                        }
                    }
                    console.log(data);
                    console.log(label);
                    
                    res.render('pages/datadb', {
                        column: new Array(),
                        chart: req.body.chart,
                        data: data,
                        label: label,
                        colors: colors 
                    });
                })
            })
        }
