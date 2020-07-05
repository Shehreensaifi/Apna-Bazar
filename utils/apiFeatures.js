class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        //Copying query object
        const queryObj = { ...this.queryString };
        console.log(queryObj);
        //Removing given fields from queryObj
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach(el => delete queryObj[el]);

        //Adding $ before gte,gt,lte and lt if exists
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            match => `$${match}`
        );
        console.log(queryStr);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            console.log(sortBy);
            this.query = this.query.sort(sortBy);
        }
        return this;
    }
}

module.exports = APIFeatures;
