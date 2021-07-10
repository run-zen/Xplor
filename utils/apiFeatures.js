class APIfeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        const queryObj = { ...this.queryStr };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lt|lte)\b/g,
            (match) => `$${match}`
        );

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            const sortStr = this.queryStr.sort.split(",").join(" ");
            this.query = this.query.sort(sortStr);
        } else {
            this.query = this.query.sort("createdAt");
        }

        return this;
    }

    limitFields() {
        if (this.queryStr.fields) {
            const fieldStr = this.queryStr.fields.split(",").join(" ");
            this.query = this.query.select(fieldStr);
        } else {
            this.query = this.query.select("-__v");
        }
        return this;
    }

    paginate() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

export { APIfeatures };
