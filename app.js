const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

//connection to mongoDB
mongoose.connect('mongodb+srv://node-shop:' + process.env.MONGO_ATLAS_PW + '@node-rest-shop-utjpf.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true,
});
//2nd argument object added to connect function is deprecated
// { useNewUrlParser: true });


//logs requests
app.use(morgan('dev'));

//setting to false selects simple bodies; setting to true selects rich bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//append headers to overcome CORS errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-requested, Content-Type, Accept, Authorization");

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    //return next so the other routes can run
    next();
});



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