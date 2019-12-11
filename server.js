const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const dbConfig = require('./config/database.js')
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const users = require('./routes/users');
const employees = require('./routes/employees');
const path = require('path');
const exphbs = require('express-handlebars');
const showEmployeeController = require('./app/api/controllers/showEmployees')
const showUserController = require('./app/api/controllers/showUsers')

app.set('secretKey', 'nodeRestApi');
mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.json({ "tutorial": "Build REST API with node.js" });
});

app.set('views', path.join(__dirname, '/app/api/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/app/api/views/layouts' }));
app.set('view engine', 'hbs')

app.use('/dataUsers', users);
app.use('/dataEmployee', validateUser, employees)
app.use('/employee', showEmployeeController)
app.use('/user', showUserController)
//nanti coba hapus yaa mana tau gk perlu
app.get('/favicon.ico', function (req, res) {
    res.sendStatus(204);
});

function validateUser(req, res, next) {
    let token = req.headers['authorization'];
    if (token) {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
            jwt.verify(token, req.app.get('secretKey'), function (err, decode) {
                if (err) {
                    res.json({ status: 'error', message: err.message, data: null });
                } else {
                    req.body.userId = decode.id;
                    next();
                }
            })
        } else {
            res.json({ status: "error", message: 'token not complete', data: null });
        }
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
}

// app.use(function (req, res, next) {
//     let err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// app.use(function (err, req, res, next) {
//     if (err.status === 404) {
//         res.status(404).json({ message: "NOt Found" })
//     } else {
//         res.status(500).json({ message: "Something looks wrong !!!" });
//     }
// });

app.listen(4000, function () { console.log('Node server listening on port 4000'); });

