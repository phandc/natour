const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModels');

dotenv.config({path: './config.env'}); //need to process before init app.


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(con => console.log("DB connection successful"));



const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

const importData = async() => {
    try {
        await Tour.create(tours);
        console.log('Data loaded successfully!');
    }
    catch (err) {
        console.log(err);
    }   
}

const deleteData = async() => {
    try {
        await Tour.deleteMany();
        console.log('Data deleted successfully!');
        process.exit();
    }
    catch {
        console.log(err);
    }
}
if(process.argv[2] === "--import"){
    importData();
}
else if(process.argv[2] === "--delete") {
    deleteData();
}
console.log(process.argv);