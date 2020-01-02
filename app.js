const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

//logs requests
app.use(morgan('dev'));

//setting to false selects simple bodies; setting to true selects rich bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


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