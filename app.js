var connect = require('connect'),
    serveStatic = require('serve-static'),
    http = require('http');

var app = connect()
app.use(serveStatic(__dirname+'/docs'));


http.createServer(app).listen(8080);

