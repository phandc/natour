const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

//remember Schema may contains some props that DB doesn't store. DB only store passing values or required?
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'], //Validators
        unique: true,
        trim: true,
        maxlength: [50, 'A tour name must have less or equal than 40 character'],
        minlength: [10, 'A tour name must have greater than 10 character'],
        // validate: [ 
        //     validator.isAlpha, //not call here, just assigned
        //     'Tour name should only contain character'
        // ]
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating is must be above 1.0'],
        max: [5, 'Rating is must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: { 
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
         }
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            //Custom validator are only used for document creation, not updating.
            validator: function(val) {
                return val < this.price; //
            },
            message: 'Discount price should be below regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7; //use this rather than arrow function. A row function get this in scope which function is defined.
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create()

tourSchema.pre('save', function(next) {
    console.log(this);
    this.slug = slugify(this.name, {lower: true});
    next(); //call next middleware();
})
/*
tourSchema.pre('save', function(next) {
    console.log("Ready to save document..");
    next();
})

tourSchema.post('save', function(doc, next) {
    console.log('Finished the middleware');
    console.log(doc);
    next();
})
*/

// QUERRY MIDDLEWARE
/*
tourSchema.pre(/^find/, function(next){
    this.find({ secretTour: {$ne: true}}); //apply for all queries starts with find: find,findOne,etc
    this.start = Date.now();
    next();
});
tourSchema.post(/^find/, function(docs, next){
    console.log(`Query took ${Date.now() - this.start} milliseconds`);
    console.log(docs);
    next();
})
*/

//AGGEGATION MIDDLEWARE
/*
tourSchema.pre('aggregate', function(next) {
    
    this.pipeline().unshift({ $match: { secretTour: { $ne: true} }})
    console.log(this.pipeline());
    next();
})
*/

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;