var express = require('express'),
    mongoose = require('mongoose'),
    path = require('path'),
    app = express();

mongoose.connect(process.env.MONGODB)

var db = mongoose.connection;
db.once('open', function() {
    console.log('DB connected!');
});

db.on('error', function(err) {
    console.log('DB ERROR: ', err);
});

var dataSchema = mongoose.Schema({
        name: String,
        count: Number
    }),
    Data = mongoose.model('data', dataSchema);

Data.findOne({name: 'myData'}, function(err, data) {
    if (err) return console.log('Data ERROR:' + err);
    else {
        if (!data) {
            Data.create({name: 'myData', count:0}, function(err, data) {
                if (err) return console.log('Data ERROR:', err);
                else console.log('Counter initialized:', data);
            });
        }
    }
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

var data = { count: 0 };

app.get('/', function(req, res) {
    Data.findOne({name: 'myData'}, function(err, data) {
        if (err) return console.log('Data ERROR:' + err);
        else {
            data.count++;
            data.save(function(err) {
                if (err) return console.log('Data ERROR: ', err);
                else res.render('index', data);
            });
        }
    });
});

app.get('/reset', function(req, res) {
    setCounter(res, 0);
});

app.get('/count/set', function(req, res) {
    if (req.query.num) setCounter(res, req.query.num);
    else getCounter(res);
});

app.get('/count/set/:num', function(req, res) {
    if (req.params.num) setCounter(res, req.params.num);
    else getCounter(res);
});

app.listen(3000, function() {
    console.log('Server On!');
});


function setCounter(res, num) {
    console.log('setCounter');
    Data.findOne({name: 'myData'}, function(err, data) {
        if (err) return console.log('Data ERROR:' + err);
        else {
            data.count = num;
            data.save(function(err) {
                if (err) return console.log('Data ERROR: ', err);
                else res.render('index', data);
            });
        }
    });
}

function getCounter(res) {
    console.log('getCounter');
    Data.findOne({name: 'myData'}, function(err, data) {
        if (err) return console.log('Data ERROR:' + err);
        else res.render('index', data);
    });
}
