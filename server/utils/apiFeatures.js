export class APIFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };

    // Handle regex case for "name"
    if (queryObj["name"]?.["regex"])
      queryObj["name"] = `/${queryObj["name"]["regex"]}/`;

    const excludeFields = ["page", "limit", "sort", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);

    // Replace comparison operators with MongoDB syntax
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    queryStr = JSON.parse(queryStr);

    // If name is a regex, convert it to RegExp object
    if (queryStr.name) {
      const pattern = queryStr.name.slice(1, -1);
      queryStr.name = new RegExp(pattern, "i");
    }

    // Handle arrays of subdocuments like colors and reviews
    if (queryStr.colors) {
      queryStr["colors.ten"] = queryStr.colors;
      delete queryStr.colors; // remove plain color filter if used
    }

    if (queryStr.reviews) {
      queryStr["reviews.rating"] = queryStr.reviews;
      delete queryStr.reviews; // remove plain reviews filter if used
    }

    this.query = this.query.find(queryStr);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  panigation() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
