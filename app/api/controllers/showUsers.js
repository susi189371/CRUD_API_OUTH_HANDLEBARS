const express = require('express');
var app = express();
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users');

router.get('/', (req, res, next) => {
    res.render('user/addOrEditUser', {
        viewTitle: "Insert User"
    });
});

router.post('/', (req, res, next) => {
    if (req.body._id == '') {
        insertRecord(req, res, next);
    } else {
        updateRecord(req, res, next);
    }
});

function insertRecord(req, res, next) {
    var user = new User;
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.save((err, doc) => {
        if (!err) {
            res.redirect('user/listUser')
        }
        else {
            if (err.name == 'ValidationError')
                handleValidationError(err, req.body);
            res.render('user/addOrEditUser', {
                viewTitle: "Insert User",
                user: req.body
            });
        }
    })
};

function updateRecord(req, res, next) {
    User.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect('/user/listUser');
        } else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("user/listUser", {
                    viewTitle: "Update User",
                    user: req.body
                })
            }
            else
                console.log('Error during record update: ' + err)
        }
    })
}

router.get('/listUser', (req, res, next) => {
    User.find((err, docs) => {
        if (!err) {
            res.render("user/listUser", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving user list:' + err)
        }
    });
});

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res, next) => {
    User.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("user/addOrEditUser", {
                viewTitle: "Update User",
                user: {
                    name: doc.name,
                    email: doc.email,
                  }
            });
        }
    })
})

router.get('/delete/:id', (req, res, next) => {
    User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/user/listUser')
        }
        else {
            console.log('Error in user delete:' + err)
        }
    })

})

module.exports = router;