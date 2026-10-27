const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { optionalAuth, requireAuth } = require('../middleware/auth');

router.get('/products', storeController.getProducts);
router.post('/orders', optionalAuth, storeController.createOrder);
router.get('/my-orders', requireAuth, storeController.getMyOrders);

module.exports = router;
