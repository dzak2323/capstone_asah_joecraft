const express = require('express');
const router = express.Router();

const { getSummary } = require('../controllers/summaryController');
const { getForecast } = require('../controllers/forecastController');
const {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

router.get('/summary', getSummary);
router.get('/forecast', getForecast);

router.get('/transactions', getAllTransactions);
router.post('/transactions', createTransaction);
router.put('/transactions/:id', updateTransaction);
router.delete('/transactions/:id', deleteTransaction);

module.exports = router;