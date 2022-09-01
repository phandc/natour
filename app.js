const express = require('express');
const morgan = require('morgan');
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

app.use((req, res, next) => {
    console.log("Hello from the middleware");
    next();
}); //where a middleware is called depends on where it sits before or after routes because routes can call send() that will end a middleware circle. 

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})


// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', creatTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// ROUTES

app.use('/api/v1/users', userRouter);

app.use('/api/v1/tours', tourRouter);


module.exports = app;