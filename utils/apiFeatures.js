class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        const queryObj = {...this.queryString} //take all filed then create a object with {}
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el]);
    
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`) //replace {gte: 5} to {$gte} 
        this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort() {
        if(this.queryString.sort) {
            //console.log(this.queryString.sort);
            const sortBy = this.queryString.sort.split(',').join(' ');
            //console.log(sortBy);
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            //console.log(fields);
            this.query = this.query.select(fields);
            //console.log(this.query);
        }
        else {
            this.query = this.query.select('-__v') //exclude v
        }
        return this;
    }
    paginate() {
        const page = this.queryString.page ? this.queryString.page * 1 : 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
       
        return this;
    }
}

module.exports = APIFeatures;