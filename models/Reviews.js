var mongoose = require("mongoose");

var reviewSchema = mongoose.Schema({
    user_id: String,
    review_id: String ,
    stars: Number,
    text: String,
    business_id: String
});

module.exports = mongoose.model("reviews", reviewSchema);