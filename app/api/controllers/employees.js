const employeeModel = require('../models/employees');
const express = require('express');
var app = express();

module.exports = {
  getById: function (req, res, next) {
    console.log(req.body);
    employeeModel.findById(req.params.employeeId, function (err, employeeInfo) {
      if (err) {
        next(err);
      } else {
        res.json({ status: "success", message: "employee found!!!", data: { employees: employeeInfo } });
      }
    });
  },
  getAll:  function (req, res, next) {
    let employeeList = [];
    employeeModel.find({}, async function (err, employees) {
      if (err) {
        next(err);
      } else {
        for (let employee of employees) {
          employeeList.push({ id: employee._id, fullName: employee.fullName, email: employee.email, mobile: employee.mobile, city: employee.city });
        }
        res.json({ status: "success", message: "employees list found!!!", data: { employees: employeeList } });

      }
    });
  },
  updateById: function (req, res, next) {
    employeeModel.findByIdAndUpdate(req.params.employeeId, { fullName: req.body.fullName }, function (err, employeeInfo) {
      if (err)
        next(err);
      else {
        res.json({ status: "success", message: "employee updated successfully!!!", data: null });
      }
    });
  },
  deleteById: function (req, res, next) {
    employeeModel.findByIdAndRemove(req.params.employeeId, function (err, employeeInfo) {
      if (err)
        next(err);
      else {
        res.json({ status: "success", message: "employee deleted successfully!!!", data: null });
      }
    });
  },
  create: function (req, res, next) {
    employeeModel.create({ fullName: req.body.fullName, email: req.body.email, mobile: req.body.mobile, city: req.body.city }, function (err, result) {
      if (err)
        next(err);
      else
        res.json({ status: "success", message: "employee added successfully!!!", data: null });

    });
  },
 
};

