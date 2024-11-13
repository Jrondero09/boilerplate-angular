require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');
const path = require('path');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const storeController = require('./store/store.controller'); // Import store controller


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = ['http://localhost:4200'];

app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Enable sending cookies or Authorization headers
}));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'products')));

app.use('/api/warehouse', require('./warehouse/warehouse.controller'));

console.log(require('./warehouse/warehouse.controller'));


//app.use('/api/store', require('./store/store.controller'));
app.use('/api/users', require('./users/user.controller'));
app.use('/api/branches', require('./branches/branch.controller'));
app.use('/api/orders', require('./orders/order.controller'));
app.use('/api/products', require('./products/product.controller'));
app.use('/api/inventory', require('./inventories/inventory.controller'));
 

app.get('/api/store/:storeName/inventory', storeController.getStoreInventory);
app.post('/api/store/:storeName/transfer', storeController.transferStock);

app.use('/api/products', express.static(path.join(__dirname, 'products')), require('./products/product.controller'));

app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));
app.use('/accounts', require('./accounts/account.controller'));
app.use('/api-docs', require('./_helpers/swagger'));

app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));