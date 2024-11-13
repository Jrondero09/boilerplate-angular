const { DataTypes } = require('sequelize');

let stores = [
    {
        storeName: 'storeA',
        inventory: [
            { productId: 'p123', itemName: 'itemA', quantity: 50 },
            { productId: 'p124', itemName: 'itemB', quantity: 30 }
        ]
    },
    {
        storeName: 'storeB',
        inventory: [
            { productId: 'p123', itemName: 'itemA', quantity: 20 },
            { productId: 'p125', itemName: 'itemC', quantity: 15 }
        ]
    }
];

module.exports = {
    findByStoreName,
    updateStock
};

// Function to find store by name
function findByStoreName(storeName) {
    const store = stores.find(store => store.storeName === storeName);
    if (!store) throw new Error(`Store ${storeName} not found`);
    return Promise.resolve(store.inventory);
}

// Function to update stock for a specific product in a store
function updateStock(storeName, productId, quantity) {
    const store = stores.find(store => store.storeName === storeName);
    if (!store) throw new Error(`Store ${storeName} not found`);

    const product = store.inventory.find(item => item.productId === productId);
    if (product) {
        product.quantity += quantity; // Increment stock
    } else {
        store.inventory.push({ productId, itemName: `New Item (${productId})`, quantity });
    }

    return Promise.resolve();
}
