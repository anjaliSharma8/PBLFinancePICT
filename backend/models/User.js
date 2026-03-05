const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true // Removes extra spaces from the start/end
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true // Ensures emails are always stored in lowercase
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", UserSchema);