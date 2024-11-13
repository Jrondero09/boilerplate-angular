const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const warehouseService = require('../warehouse/warehouse.service');
const authorize = require('_middleware/authorize');
const Role = require('_helpers/role'); // User roles (Admin, Manager)


module.exports = router;


// Apply authorization middleware to routes
router.get('/inventory', authorize([Role.Admin, Role.Manager]), getWarehouseInventory);
router.post('/inventory', authorize([Role.Admin, Role.Manager]), updateWarehouseStock);
router.post('/transfer', authorize([Role.Admin, Role.Manager]), transferToStore);

// Controller functions
function getWarehouseInventory(req, res, next) {
    warehouseService.getInventory()
        .then(inventory => res.json(inventory))
        .catch(next);
}

function updateWarehouseStock(req, res, next) {
    const { productId, quantity } = req.body;
    warehouseService.updateStock(productId, quantity)
        .then(() => res.json({ message: 'Stock updated successfully' }))
        .catch(next);
}

function transferToStore(req, res, next) {
    const { productId, quantity, storeName } = req.body;
    warehouseService.transferToStore(productId, quantity, storeName)
        .then(() => res.json({ message: `Stock transferred to ${storeName}` }))
        .catch(next);
}
