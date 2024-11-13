const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize');
const Role = require('_helpers/role');
const storeService = require('../store/store.service'); // Store service for store inventory operations
const inventoryService = require('../inventories/inventory.service'); // Inventory service for warehouse operations

// Routes
router.get('/:storeName/inventory', authorize([Role.Admin, Role.Manager]),getStoreInventory);
router.post('/:storeName/transfer', authorize([Role.Admin]),transferStock);
module.exports = router;


module.exports = {
    getStoreInventory,
    transferStock
};

// 1. Fetch store inventory
function getStoreInventory(req, res, next) {
    storeService
        .fetchInventoryListForStore(req.params.storeName)
        .then(store => res.json(store))
        .catch(next);
}

// 2. Transfer stock from warehouse to store
function transferStock(req, res, next) {
    const { storeName } = req.params;
    const { productId, quantity } = req.body;

    // Call services to transfer stock
    inventoryService
        .updateStock(productId, -quantity) // Decrease in warehouse inventory
        .then(() => storeService.transferStock(storeName, productId, quantity)) // Add to store
        .then(updatedItem => res.json({ 
            message: 'Stock successfully transferred to store.', 
            updatedItem 
        }))
        .catch(next);
}
