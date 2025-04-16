// routes/purchaseRoutes.js
const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

// Route to create a new purchase
router.post('/create', purchaseController.createPurchase);

// Route to get all purchases for a user
router.get('/:userId', purchaseController.getUserPurchases);

// Route to handle content download
router.get('/download/:purchaseId', purchaseController.downloadContent);

module.exports = router;
