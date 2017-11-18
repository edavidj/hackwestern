var mongoose = require("mongoose");

var businessSchema = mongoose.Schema({
    business_id: String,
    full_address: String,
    open: Boolean,
    categories: [String],
    city: String,
    name: String,
    neighborhoods: [String],
    state: String,
    stars: Number,
    type: String
    }
});

module.exports = mongoose.model("businesses", businessSchema);