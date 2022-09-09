const express = require('express')
const router = express.Router()

const appraisalsController = require('../controllers/appraisalsController')

router.get('/getAllPraises', appraisalsController.getAllPraisesOfCompany)

router.post('/create', appraisalsController.makePraise)

router.get('/aggregateAppraisals', appraisalsController.getAggregateAppraisalsofEmployee)

router.get('/getInsightsData', appraisalsController.getInsightsData)

router.get('/:fromDate/:toDate', appraisalsController.filterAppraisalByDate)

router.put('/updatePointsOfEmployee', appraisalsController.updatePointsOfEmployee)

module.exports = router