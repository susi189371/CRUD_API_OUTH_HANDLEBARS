const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
module.exports = {
   getAll: function (req, res, next) {
      let userList = [];
      userModel.find({}, async function (err, users) {
         if (err) {
            next(err);
         } else {
            for (let user of users) {
               userList.push({ id: user._id, name: user.name, email: user.email, password: user.password });
            }
            res.json({ status: "success", message: "users list found!!!", data: { users: userList } });

         }
      });
   },
   create: function (req, res, next) {

      userModel.create({ name: req.body.name, email: req.body.email, password: req.body.password }, function (err, result) {
         if (err)
            next(err);
         else
            res.json({ status: "success", message: "User added successfully!!!", data: null });

      });
   },
   authenticate: function (req, res, next) {
      userModel.findOne({ email: req.body.email }, function (err, userInfo) {
         if (err) {
            next(err);
         } else {
            if (bcrypt.compareSync(req.body.password, userInfo.password)) {
               const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'), { expiresIn: '1h' });
               res.json({ status: "success", message: "user found!!!", data: { user: userInfo, token: token } });
            } else {
               res.json({ status: "error", message: "Invalid email/password!!!", data: null });
            }
         }
      });
   },
}