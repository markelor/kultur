/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
// Validate Function to check blog title length
let titleLengthChecker = (title) => {
    // Check if blog title exists
    if (!title) {
        return false; // Return error
    } else {
        // Check the length of title
        if (title.length < 3 || title.length > 35) {
            return false; // Return error if not within proper length
        } else {
            return true; // Return as valid title
        }
    }
};

// Validate Function to check if valid title format
let alphaNumericTitleChecker = (title) => {
    // Check if title exists
    if (!title) {
        return false; // Return error
    } else {
        // Regular expression to test for a valid title
        const regExp = new RegExp(/^[A-zÀ-ÖØ-öø-ÿ\s]+$/);
        return regExp.test(title); // Return regular expression test results (true or false)
    }
};

// Array of Title Validators
const titleValidators = [
    // First Title Validator
    {
        validator: titleLengthChecker,
        message: '.validation.titleLength'
    },
    // Second Title Validator
    {
        validator: alphaNumericTitleChecker,
        message: '.validation.titleValid'
    }
];

// serviceType Model Definition
const serviceTypeSchema = new Schema({
    language: { type: String, required: true },
    title: { type: String, required: true, validate: titleValidators },
    icons: { type: Array, required: false },
    translation: [{
        language: { type: String, required: true },
        title: { type: String, required: true, validate: titleValidators },
        _id: false
    }],
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true }
});
serviceTypeSchema.index({ createdAt: -1 }); // schema level

// Export Module/Schema
module.exports = mongoose.model('ServiceType', serviceTypeSchema);