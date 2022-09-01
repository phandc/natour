const mongoose = require('mongoose');
const dotenv = require('dotenv');


process.on('uncaughtException', err => {
    console.log('UNHANDLED EXCEPTION');
    console.log(err.name, err.message);
    process.exit(1);
});


dotenv.config({path: './config.env'}); //need to process before init app.

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(con => console.log("DB connection successful"))
    



const port = process.env.PORT || 3000;

const server = app.listen(port, (req, res, next) => {
    console.log(`The server is listening on port ${port}`);
})

process.on('unhandledRejection', err => {
    console.log(err.name);
    console.log('UNHANDLED REJECTION')
    server.close(() => {
        process.exit(1);
    });
});
