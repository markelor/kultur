/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
// Validate Function to check location length
let locationLengthChecker = (location) => {
    // Check if location exists
    if (location) {
        // Check length of location
        if (location.length > 1000) {
            return false; // Return error if does not meet length requirement
        } else {
            return true; // Return as valid location
        }
    }
};

// Array of Location validators
const locationValidators = [
    // First location validator
    {
        validator: locationLengthChecker,
        message: '.validation.locationLength'
    }
];
// Validate Function to check if valid latidude format
let latitudeChecker = (lat) => {
    // Check if lat exists
    if (!lat) {
        return false; // Return error
    } else {
        // Regular expression to test for a valid latitude
        const regExp = new RegExp(/^(\+|-)?(?:90(?:(?:\.0{1,20})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,20})?))$/);
        return regExp.test(lat); // Return regular expression test results (true or false)
    }
};

// Array of Latitude validators
const latitudeValidators = [
    // First latitude validator
    {
        validator: latitudeChecker,
        message: '.validation.latitudeValid'
    }
];
// Validate Function to check if valid longitude format
let longitudeChecker = (lng) => {
    // Check if lng exists
    if (!lng) {
        return false; // Return error
    } else {
        // Regular expression to test for a valid longitude
        const regExp = new RegExp(/^(\+|-)?(?:180(?:(?:\.0{1,20})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,20})?))$/);
        return regExp.test(lng); // Return regular expression test results (true or false)
    }
};

// Array of Longitude validators
const longitudeValidators = [
    // First longitude validator
    {
        validator: longitudeChecker,
        message: '.validation.longitudeValid'
    }
];

// Place Model Definition
const placeSchema = new Schema({
    language: { type: String, required: true },
    province: {
        geonameId: { type: Number, required: true },
        name: { type: String, required: true }
    },
    municipality: {
        geonameId: { type: Number, required: true },
        name: { type: String, required: true }
    },
    location: { type: String, required: true, validate: locationValidators },
    translation: [{
        language: { type: String, required: true },
        province: {
            name: { type: String, required: true }
        },
        municipality: {
            name: { type: String, required: true }
        },
        location: { type: String, required: true, validate: locationValidators },
        _id: false
    }],
    coordinates: {
        lat: { type: Number, requireed: true, validate: latitudeValidators },
        lng: { type: Number, requireed: true, validate: longitudeValidators }
    },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true }
});
placeSchema.index({ createdAt: -1 }); // schema level
// Export Module/Schema
module.exports = mongoose.model('Place', placeSchema);