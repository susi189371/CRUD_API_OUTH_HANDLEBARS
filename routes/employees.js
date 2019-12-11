const express = require('express');
const router = express.Router();
const employeeController = require('../app/api/controllers/employees');
router.get('/', employeeController.getAll);
router.post('/', employeeController.create);
router.get('/:employeeId', employeeController.getById);
router.put('/:employeeId', employeeController.updateById);
router.delete('/:employeeId', employeeController.deleteById);
module.exports = router;