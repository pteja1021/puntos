const express = require("express")
const router = express.Router()

const employeeController = require('../controllers/employeesController')

router.get("/", employeeController.getAllEmployeesOfCompany)

router.post("/", employeeController.createEmployeeInCompany)

router.get("/isAdmin", employeeController.isAdmin)

router.put("/toggleAdmin/", employeeController.toggleAdminPrivilege)

router.put("/inactivate", employeeController.inactivateAnEmployee)

router.get("/getMonthlyPoints", employeeController.getMonthlyPoints)
module.exports = router