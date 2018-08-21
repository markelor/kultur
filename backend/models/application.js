/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
// Validate Function to check application title length
let titleLengthChecker = (title) => {
    // Check if application title exists
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
// Validate Function to check application name length
let nameLengthChecker = (name) => {
    // Check if application name exists
    if (!name) {
        return false; // Return error
    } else {
        // Check the length of name
        if (name.length < 5 || name.length > 35) {
            return false; // Return error if not within proper length
        } else {
            return true; // Return as valid name
        }
    }
};

// Validate Function to check if valid name format
let alphaNumericNameChecker = (name) => {
    // Check if name exists
    if (!name) {
        return false; // Return error
    } else {
        // Regular expression to test for a valid name
        const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
        return regExp.test(name); // Return regular expression test results (true or false)
    }
};

// Array of Name Validators
const nameValidators = [
    // First Name Validator
    {
        validator: nameLengthChecker,
        message: '.validation.nameLength'
    },
    // Second Name Validator
    {
        validator: alphaNumericNameChecker,
        message: '.validation.nameValid'
    }
];
// Validate Function to check description length
let descriptionLengthChecker = (description) => {
    // Check if description exists
    if (!description) {
        return false; // Return error
    } else {
        // Check length of description
        if (description.length < 5 || description.length > 300) {
            return false; // Return error if does not meet length requirement
        } else {
            return true; // Return as valid description
        }
    }
};

// Array of Description validators
const descriptionValidators = [
    // First description validator
    {
        validator: descriptionLengthChecker,
        message: '.validation.applicationObservationsDescriptionLength'
    }
];
// Application Model Definition
const applicationSchema = new Schema({
    users: { type: Array, required: true },
    events: [{ type: Schema.Types.ObjectId, required: true }],
    services: [{ type: Schema.Types.ObjectId, required: true } ],
    observations:[{ type: Schema.Types.ObjectId, required: true }],
    language: { type: String, required: true },
    title: { type: String, required: true, validate: titleValidators },
    entityName: { type: String, required: false, validate: nameValidators },
    licenseName: { type: String, required: true },
    conditions: { type: Array, required: true },
    translation: [{
        language: { type: String, required: true },
        title: { type: String, required: true, validate: titleValidators },
        entityName: { type: String, required: false, validate: nameValidators },
        licenseName: { type: String, required: true },
        conditions: { type: Array, required: true },
        _id: false
    }],
    price: { type: Number, required: true },
    expiredAt: { type: Date, required: true },
    images: { type: Array, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true }
});
applicationSchema.index({ createdAt: -1 }); // schema level
// Export Module/Schema
module.exports = mongoose.model('Application', applicationSchema);