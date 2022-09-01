const Tour = require('./../models/tourModels');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

exports.getAllTours = async (req, res) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
        const tours = await features.query;
        
        //SEND RESPONSE
        res.status(200).json({
            status: 'success',
            result: tours.length,
            data: {
                tours
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
}
exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        //Tour.findOne({_id: req.params.id})
        
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
  
}

exports.creatTour = async (req, res) => {

    try {      
        //const newTour = new Tour({}); 
        //newTour.save() // document
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err
        })
    }
   
}


exports.updateTour = async (req, res) => {
    try {      
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(201).json({
            status: 'success',
            data: {
                tour: tour
            }
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err
        })
    }
};


exports.deleteTour = async (req, res) => {
    try {      
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: {
                tour: null
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
};


exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([ //aggregation pipeline
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id:  { $toUpper: '$difficulty'},
                    numTours: { $sum: 1},
                    numRating: { $sum: '$ratingsQuantity'},
                    avgRating: { $avg: '$ratingsAverage'},
                    avgPrice: { $avg: '$price'},
                    minPrice: { $min: '$price'},
                    maxPrice: { $max: '$price'}
                }
            },
            {
                $sort: { avgPrice: 1} //1 is ascending
            }
            // {
            //     $match: {_id: { $ne: 'EASY'}}
            // }
        ]);
        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
}

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1;
        console.log(year);
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates' //deconstruct an array of field from the input document to each instance output
            },
            { //stage 2
                
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    },
                }     
            }, 
            { //stage 3
                $group: {
                            _id: { $month: '$startDates'},
                            numTourStarts: { $sum: 1},
                            tours: { $push: '$name'}
                        }
            },
            {
                $addFields: {month: '$_id'}
            }, 
            {
                $project: { _id: 0 } //include or exclude
            },
            {
                $sort: { numTourStarts: -1}
            }

        ]);
        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
}