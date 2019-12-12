const employeeModel = require('../models/employees');
const express = require('express');
var app = express();

module.exports = {
  getById: function (req, res, next) {
    employeeModel.findById(req.params.employeeId, function (err, employeeInfo) {
      if (err) {
        next(err);
      } else {
        res.json({ status: "success", message: "employee found!!!", data: { employees: employeeInfo } });
      }
    });
  },

  getAll: function (req, res, next) {
    let employeeList = [];
    let pageNo = parseInt(req.query.page)
    let size = parseInt(req.query.size)
    let query = {}

    if (pageNo < 0 || pageNo === 0) {
      response = { "error": true, "message": "no result" };
      return res.json(response);
    }

    query.skip = size * (pageNo - 1)
    query.limit = size

    employeeModel.count({}, function (err, totalCount) {
      if (err) {
        response = { "error": true, "message": "Error fetching data" }
      }
      employeeModel.find({}, {}, query, function (err, employees) {
        if (err) {
          next(err);
        } else {
          let totalPages = Math.ceil(totalCount / size)
          for (let employee of employees) {
            employeeList.push({ id: employee._id, fullName: employee.fullName, email: employee.email, mobile: employee.mobile, city: employee.city });
          }
          res.json({ status: "success", message: "employees list found!!!", data: { employees: employeeList }, pagination: { "length data": totalCount, "page": pageNo, "total page": totalPages } });

        }
      });
    });
  },

  getByParams: function (req, res, next) {
    let employeeList = [];
    let pageNo = parseInt(req.query.page)
    let size = parseInt(req.query.size)
    let query = {}

    if (pageNo < 0 || pageNo === 0) {
      response = { "error": true, "message": "no result" };
      return res.json(response);
    }

    query.skip = size * (pageNo - 1)
    query.limit = size

    employeeModel.count({}, function (err, totalCount) {
      if (err) {
        response = { "error": true, "message": "Error fetching data" }
      }
      let query = { fullName: new RegExp(req.params.fullName, 'i') }
      let query2 = { email: new RegExp(req.params.fullName, 'i') }
      let query3 = { city: new RegExp(req.params.fullName, 'i') }

      employeeModel.find({ $or: [query, query2, query3] }, {}, query, function (err, employees) {
        if (err) {
          next(err);
        } else {
          let totalPages = Math.ceil(totalCount / size)

          for (let employee of employees) {
            employeeList.push({ id: employee._id, fullName: employee.fullName, email: employee.email, mobile: employee.mobile, city: employee.city });
          }
          res.json({ status: "success", message: "employees list found!!!", data: { employees: employeeList }, pagination: { "length data": totalCount, "page": pageNo, "total page": totalPages } });

        }
      });
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

