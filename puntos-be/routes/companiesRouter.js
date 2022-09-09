const express = require('express');
const router = express.Router();

const companiesRouter = require('../controllers/companiesController')

router.post('/create', companiesRouter.createCompany)

module.exports = router;
