const express = require('express');
var app = express();
var router = express.Router();
const mongoose = require('mongoose');
const Employee = require('../models/employees');

router.get('/', (req, res, next) => {
    res.render('employee/addOrEdit', {
        viewTitle: "Insert Employee"
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
    var employee = new Employee;
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.mobile = req.body.mobile;
    employee.city = req.body.city;
    employee.save((err, doc) => {
        if (!err) {
            res.redirect('employee/list')
        }
        else {
            if (err.name == 'ValidationError')
                handleValidationError(err, req.body);
            res.render('employee/addOrEdit', {
                viewTitle: "Insert Employee",
                employee: req.body
            });
        }
    })
};

function updateRecord(req, res, next) {
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect('/employee/list');
        } else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/list", {
                    viewTitle: "Update Employee",
                    employee: req.body
                })
            }
            else
                console.log('Error during record update: ' + err)
        }
    })
}

router.get('/list', (req, res, next) => {
    Employee.find((err, docs) => {
        if (!err) {
            res.render("employee/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list:' + err)
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
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("employee/addOrEdit", {
                viewTitle: "Update Employee",
                employee: doc
            });
        }
    })
})

router.get('/delete/:id', (req, res, next) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employee/list')
        }
        else {
            console.log('Error in employee delete:' + err)
        }
    })

})

module.exports = router;