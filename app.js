const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRouters');
const userRouter = require('./routes/userRouters');

const app = express();

// 1) MIDDLEWARES
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); //middleware for logger request
}

app.use(express.json()); //middleware

app.use(express.static(`${__dirname}/public`)); //enable server static file

// app.use((req, res, next) => {
//     console.log("Hello from the middleware");
//     next();
// }); 
//where a middleware is called depends on where it sits before or after routes because routes can call send() that will end a middleware circle. 

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// ROUTES

app.use('/api/v1/users', userRouter);

app.use('/api/v1/tours', tourRouter);


//Only for check unhandled route.
app.all('*', (req, res, next) => {

    // const err = new Error(`Cannot find ${req.originalUrl} on this server!`);
    // err.status = 'fail';
    // err.statusCode = 404;

    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 400)); //if next() has arguments, express will raise an error.
});

//Error middleware
app.use(globalErrorHandler);

module.exports = app;