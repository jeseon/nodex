var express = require('express'),
    path = require('path'),
    app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

var data = { count: 0 };

app.get('/', function(req, res) {
    data.count++;
    res.render('index', data);
});

app.get('/reset', function(req, res) {
    data.count = 0;
    res.render('index', data);
});

app.get('/count/set', function(req, res) {
    if (req.query.num)
        data.count = req.query.num;
    res.render('index', data);
});

app.get('/count/set/:num', function(req, res) {
    data.count = req.params.num;
    res.render('index', data);
});

app.listen(3000, function() {
    console.log('Server On!');
});
