const express = require('express');
const app = express();
const morgan = require('morgan');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

//logs requests
app.use(morgan('dev'));

//middleware: handles request routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);


//throw errors that reach middleware and anywhere else in the application  
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

//for the db
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });

});


module.exports = app;