const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'}); //need to process before init app.

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(con => console.log("DB connection successful"));



const port = process.env.PORT || 3000;

app.listen(port, (req, res, next) => {
    console.log(`The server is listening on port ${port}`)
})