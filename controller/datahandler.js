var fs = require('fs');

module.exports.controller = function(app) {

/**
 * a home page route
 */
app.get('/data', function(req, res) {
    // any logic goes here
    
    
    var global = load();
    var order = global.order;
    console.log(order.length);
    order.forEach(function(data, index) {
        for (var i = 0; i < data.newObject.Dbc_Linecart.length; i++) {
            console.log('------------------');
            console.log(data.newObject.Dbc_Linecart[i].Fixedproduct.name);
            console.log(data.newObject.Dbc_Linecart[i].Fixedproduct.quantity);
        }
    })
    res.render('pages/data')
});

}

function load() {
    var file = 'traces.json';
    
    var post = new Array();
    var order = new Array();
    var linecart = new Array();
    var production = new Array();
    var product = new Array();
    
    var text = fs.readFileSync('traces.json','utf8')
    data = text.split(/\r\n/)
    
    data.forEach(function(line, index) {
        if (line.length > 0) {
            line = JSON.parse(line)
            
            switch (line.model_to_join) {
                case 'Post':
                    post.push(line)
                    break;
                case 'Dbc_Order':
                    order.push(line)
                    break;
                case 'Dbc_Linecart':
                    linecart.push(line)
                    break;
                case 'Dbc_Production':
                    production.push(line)
                    break;
                case 'Fixedproduct':
                    product.push(line)
                    break;
                default:
                    
            }
        }
    });
    var global = new Array();
    global.order = order;
    global.post = post;
    global.linecart = linecart;
    global.production = production;
    global.product = product;
    
    return global;
}
