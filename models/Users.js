var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    name: String, 
    user_id: String
    }
});

module.exports = mongoose.model("users", userSchema);