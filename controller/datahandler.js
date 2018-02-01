var fs = require('fs');

module.exports.controller = function(app) {
    
    // TODO: put route in global file
    app.get('/datajson', function(req, res) {
        var global = load();
        
        var dataPR = prepareData(productRatio(global.order), 'pie');
        var dataPS = prepareData(productSales(global.order), 'bar');
        
        res.render('pages/datajson', {
            titlePR : 'Quantité produit vendu',
            dataPR  : dataPR,
            titlePS : 'Vente des produit',
            dataPS  : dataPS
        });
    });
}

function prepareData(dataIn, chart) {
    switch (chart) {
        case 'pie':
        dataOut = basicPrepare(dataIn)
        break;
        default:
        dataOut = basicPrepare(dataIn)
    }
    console.log(dataOut);
    return dataOut;
}

function basicPrepare(data) {
    var dataOut = new Array();
    dataOut.datasets = new Array();
    dataOut.labels = new Array();
    for (var key in data) {
        dataOut.datasets.push(data[key])
        dataOut.labels.push(key)
    }
    return dataOut
}
function productRatio(order) {
    var result = new Array();
    order.forEach(function(data, index) {
        for (var i = 0; i < data.newObject.Dbc_Linecart.length; i++) {
            
            if (result[data.newObject.Dbc_Linecart[i].Fixedproduct.name] == undefined) {
                result[data.newObject.Dbc_Linecart[i].Fixedproduct.name] = parseInt(data.newObject.Dbc_Linecart[i].Fixedproduct.quantity);
            } else {
                result[data.newObject.Dbc_Linecart[i].Fixedproduct.name] += parseInt(data.newObject.Dbc_Linecart[i].Fixedproduct.quantity);
            }
        }
    })
    return result;
}

function productSales(order) {
    var result = new Array();
    order.forEach(function(data, index) {
        for (var i = 0; i < data.newObject.Dbc_Linecart.length; i++) {
            
            if (result[data.newObject.Dbc_Linecart[i].Fixedproduct.name] == undefined) {
                result[data.newObject.Dbc_Linecart[i].Fixedproduct.name] = parseInt(data.newObject.Dbc_Linecart[i].price_ttc);
            } else {
                result[data.newObject.Dbc_Linecart[i].Fixedproduct.name] += parseInt(data.newObject.Dbc_Linecart[i].price_ttc);
            }
        }
    })
    return result;
}

function load() {
    var file = 'traces.json';
    
    var post = new Array();
    var order = new Array();
    var linecart = new Array();
    var production = new Array();
    var product = new Array();
    
    var text = fs.readFileSync('traces.json', 'utf8')
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
