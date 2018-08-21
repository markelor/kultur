/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
// Validate Function to check event title length
let titleLengthChecker = (title) => {
    // Check if event title exists
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

// Validate Function to check description length
let descriptionLengthChecker = (description) => {
    // Check if description exists
    if (!description) {
        return false; // Return error
    } else {
        // Check length of description
        if (description.length < 5 || description.length > 20000) {
            return false; // Return error if does not meet length requirement
        } else {
            return true; // Return as valid description
        }
    }
};
// Validate Function to check observations length
let observationsLengthChecker = (observations) => {
    // Check if observations exists
    if (observations) {
        // Check observations length
        if (observations.length > 1000) {
            return false; // Return error if observations length requirement is not met
        } else {
            return true; // Return observations as valid
        }
    }
};

// Array of Observations validators
const observationsValidators = [
    // First observations validator
    {
        validator: observationsLengthChecker,
        message: '.validation.observationsLength'
    }
];

// Array of Description validators
const descriptionValidators = [
    // First description validator
    {
        validator: descriptionLengthChecker,
        message: '.validation.eventDescriptionLength'
    }
];

// Event Model Definition
const eventSchema = new Schema({
    createdBy: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, required: true },
    placeId: { type: Schema.Types.ObjectId, required: true },
    participants: { type: Array, required: false },
    language: { type: String, required: true },
    title: { type: String, required: true, validate: titleValidators },
    description: { type: String, required: true, validate: descriptionValidators },
    observations: { type: String, validate: observationsValidators },
    images: {
        poster: { type: Array, required: true },
        description: { type: Array, required: false }
    },
    translation: [{
        language: { type: String, required: true },
        createdBy: { type: String, required: true },
        title: { type: String, required: true, validate: titleValidators },
        description: { type: String, required: true, validate: descriptionValidators },
        observations: { type: String, validate: observationsValidators },
        images: {
            poster: { type: Array, required: true },
            description: { type: Array, required: false }
        },
        _id: false
    }],
    visible: { type: Boolean, required: true, default: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    price: { type: Number, required: true, default:0 },
    services: { type: Array, required: false },
    reactions: {
        likeBy: { type: Array, required: false },
        loveBy: { type: Array, required: false },
        hahaBy: { type: Array, required: false },
        wowBy: { type: Array, required: false },
        sadBy: { type: Array, required: false },
        angryBy: { type: Array, required: false },
    },

    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true }
});
eventSchema.index({ start: -1 }); // schema level


// Export Module/Schema
module.exports = mongoose.model('Event', eventSchema);