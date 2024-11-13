const db = require('../_helpers/db'); // Ensure this points to your db.js
const Warehouse = db.Warehouse;       // Sequelize Warehouse model
const Store = db.Store;               // Sequelize Store model

module.exports = {
    getInventory,
    updateStock,
    transferToStore
};

async function getInventory() {
    return await db.Warehouse.findAll(); // Retrieve all items in the warehouse
}

async function updateStock(productId, quantity) {
    const product = await db.Warehouse.findOne({ where: { productId } }); // Sequelize `findOne`

    if (!product) {
        // Create a new product entry if it doesn't exist
        await db.Warehouse.create({ productId, quantity });
    } else {
        // Update the existing product quantity
        product.quantity += quantity;
        await product.save();
    }
}

async function transferToStore(productId, quantity, storeName) {
    const product = await db.Warehouse.findOne({ where: { productId } });

    if (!product || product.quantity < quantity) {
        throw new Error('Insufficient stock in warehouse');
    }

    // Reduce stock in warehouse
    product.quantity -= quantity;
    await product.save();

    // Update stock in the target store
    const storeProduct = await db.Store.findOne({ where: { productId, storeName } });
    if (storeProduct) {
        storeProduct.quantity += quantity;
        await storeProduct.save();
    } else {
        await db.Store.create({ productId, storeName, quantity });
    }
}
