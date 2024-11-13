const express = require('express');
const router = express.Router();
const Joi = require('joi');
const orderService = require('./order.service');
const authorize = require('_middleware/authorize');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');

router.get('/', authorize([Role.Admin, Role.Manager]), getAllOrders);
router.get('/:id', authorize([Role.Admin, Role.Manager]), getOrderById);
router.post('/', authorize([Role.User]), createOrderSchema, create);
router.put('/:id', authorize([Role.Admin, Role.Manager]), updateOrderSchema, update);
router.put('/:id/cancel', authorize([Role.Admin, Role.Manager, Role.User]), cancelOrder);
router.get('/:id/status', authorize([Role.User]), trackOrderStatus);
router.put('/:id/process', authorize([Role.Admin, Role.Manager]), processOrder);
router.put('/:id/ship', authorize([Role.Admin, Role.Manager]), shipOrder);
router.put('/:id/deliver', authorize([Role.Admin, Role.Manager]), deliverOrder);

module.exports = router;

//getall
function getAllOrders(req, res, next) {
    orderService.getAllOrders()
        .then(orders => res.json(orders))
        .catch(next);
}

//get by id
function getOrderById(req, res, next) {
    orderService.getOrderById(req.params.id)
        .then(order => res.json(order))
        .catch(next);
}

// create order

function create(req, res, next) {
    const { price, quantity } = req.body;
 
     // Automatically calculate the total amount
     const totalAmount = price * quantity;  // $500 * 2 = $1000
 
     // Create the order data object, including totalAmount
     const orderData = {
         ...req.body,
         totalAmount,  // Add total amount to the data
         status: req.body.status || 'pending'  // Default status is 'pending' if not provided
     };
 
     // Call the service to create the order
     orderService.create(orderData)
         .then(newOrder => 
             res.json({ 
                 message: 'Order Created', 
                 totalAmount: newOrder.totalAmount // Include totalAmount in the response
             })
         )
         .catch(next);  // Pass errors to the error middleware
 }
 

function createOrderSchema(req, res, next) {
    const schema = Joi.object({
        customerId: Joi.number().integer().required(),
        productId: Joi.number().integer().required(),
        productName: Joi.string().required(),
        quantity: Joi.number().integer().required(),
        price: Joi.number().required(),
        shippingAddress: Joi.string().required(),
        //totalAmount: Joi.number().required(),
        //role: Joi.string().valid(Role.Admin, Role.Customer).required(),
        status: Joi.string().valid('pending', 'shipped', 'delivered', 'cancelled').optional()
    });

    validateRequest(req, next, schema);
}

//update order
function update(req, res, next) {
    const { price, quantity } = req.body;
    
    // Automatically calculate the total amount
    const totalAmount = price * quantity;  // Example: $500 * 2 = $1000
    
    // Create the order data object, including totalAmount
    const orderData = {
        ...req.body,
        totalAmount,  // Add total amount to the data
        status: req.body.status || 'pending'  // Default status is 'pending' if not provided
    };

    // Use orderData (not req.body) to ensure totalAmount is included in the update
    orderService.update(req.params.id, orderData)
        .then(() => res.json({ message: 'Order Updated' }))
        .catch(next);
        
}


function updateOrderSchema(req, res, next) {
    const schema = Joi.object({
        productName: Joi.string().empty(''),
        quantity: Joi.number().empty(''),
        price: Joi.number().empty(''),
        //totalAmount: Joi.number().empty('')
    });
    validateRequest(req, next, schema);
}

//cancel order
function cancelOrder(req, res, next) {
    orderService.cancelOrder(req.params.id) 
        .then(() => res.json({ message: 'Order Cancelled' }))
        .catch(next);
}


//track order 
function trackOrderStatus(req, res, next) {
    const id = req.params.id;  
    orderService.getOrderStatus(id) 
        .then(status => res.json({ status }))  
        .catch(next); 
}

//process order
function processOrder(req, res, next) {
    const id = req.params.id;  
    orderService.processOrder(id)  
        .then(() => res.json({ message: 'Order processed successfully.' })) 
        .catch(next);  
}


//ship order
function shipOrder(req, res, next) {
    const id = req.params.id;  
    orderService.shipOrder(id)  
        .then(() => res.json({ message: 'Order shipped successfully.' })) 
        .catch(next);  
}


//deliver order
function deliverOrder(req, res, next) {
    const orderId = req.params.id;  
    orderService.deliverOrder(orderId)  
        .then(() => res.json({ message: 'Order delivered successfully.' })) 
        .catch(next);  
}
