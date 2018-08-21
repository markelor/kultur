/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
const bcrypt = require('bcrypt-nodejs'); // A native JS bcrypt library for NodeJS

// Validate Function to check e-mail length
let emailLengthChecker = (email) => {
    // Check if e-mail exists
    if (!email) {
        return false; // Return error
    } else {
        // Check the length of e-mail string
        if (email.length < 5 || email.length > 30) {
            return false; // Return error if not within proper length
        } else {
            return true; // Return as valid e-mail
        }
    }
};

// Validate Function to check if valid e-mail format
let validEmailChecker = (email) => {
    // Check if e-mail exists
    if (!email) {
        return false; // Return error
    } else {
        // Regular expression to test for a valid e-mail
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email); // Return regular expression test results (true or false)
    }
};

// Array of Email Validators
const emailValidators = [
    // First Email Validator
    {
        validator: emailLengthChecker,
        message: '.validation.emailLength'
    },
    // Second Email Validator
    {
        validator: validEmailChecker,
        message: '.validation.emailValid'
    }
];
// Validate Function to check name length
let nameLengthChecker = (name) => {
    // Check if name exists
    if (!name) {
        return false; // Return error
    } else {
        // Check length of name string
        if (name.length < 5 || name.length > 35) {
            return false; // Return error if does not meet length requirement
        } else {
            return true; // Return as valid name
        }
    }
};

// Validate Function to check if valid name format
let validName = (name) => {
    // Check if name exists
    if (!name) {
        return false; // Return error
    } else {
        // Regular expression to test if name format is valid
        const regExp = new RegExp(/^[A-zÀ-ÖØ-öø-ÿ\s]+$/);
        return regExp.test(name); // Return regular expression test result (true or false)
    }
};
// Array of Name validators
const nameValidators = [
    // First Name validator
    {
        validator: nameLengthChecker,
        message: '.validation.nameLength'
    },
    // Second name validator
    {
        validator: validName,
        message: '.validation.nameValid'
    }
];

// Validate Function to check username length
let usernameLengthChecker = (username) => {
    // Check if username exists
    if (!username) {
        return false; // Return error
    } else {
        // Check length of username string
        if (username.length < 3 || username.length > 15) {
            return false; // Return error if does not meet length requirement
        } else {
            return true; // Return as valid username
        }
    }
};

// Validate Function to check if valid username format
let validUsername = (username) => {
    // Check if username exists
    if (!username) {
        return false; // Return error
    } else {
        // Regular expression to test if username format is valid
        const regExp = new RegExp(/^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/);
        return regExp.test(username); // Return regular expression test result (true or false)
    }
};


// Array of Username validators
const usernameValidators = [
    // First Username validator
    {
        validator: usernameLengthChecker,
        message: '.validation.usernameLength'
    },
    // Second username validator
    {
        validator: validUsername,
        message: '.validation.usernameValid'
    }
];

// Validate Function to check password length
let passwordLengthChecker = (password) => {
    // Check if password exists
    if (!password) {
        return false; // Return error
    } else {
        // Check password length
        if (password.length < 8 || password.length > 35) {
            return false; // Return error if passord length requirement is not met
        } else {
            return true; // Return password as valid
        }
    }
};

// Validate Function to check if valid password format
let validPassword = (password) => {
    // Check if password exists
    if (!password) {
        return false; // Return error
    } else {
        // Regular Expression to test if password is valid format
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password); // Return regular expression test result (true or false)
    }
};

// Array of Password validators
const passwordValidators = [
    // First password validator
    {
        validator: passwordLengthChecker,
        message: '.validation.passwordLength'
    },
    // Second password validator
    {
        validator: validPassword,
        message: '.validation.passwordValid'
    }
];
// Validate Function to check abotYourself length
let aboutYourselfLengthChecker = (aboutYourself) => {
    // Check if aboutYourself exists
    if (!aboutYourself) {
        return true; //  Return as valid aboutYourself
    } else {
        // Check length of aboutYourself string
        if (aboutYourself.length > 500) {
            return false; // Return error if does not meet length requirement
        } else {
            return true; // Return as valid aboutYourself
        }
    }
};
// Array of aboutYourself Validators
const aboutYourselfValidators = [
    // First aboutYourself Validator
    {
        validator: aboutYourselfLengthChecker,
        message: '.validation.aboutYourselfLength'
    }
];


// User Model Definition
const userSchema = new Schema({
    name: { type: String, required: true, validate: nameValidators },
    email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
    username: { type: String, required: true, unique: true, validate: usernameValidators },
    password: { type: String, required: true, validate: passwordValidators, select: false },
    active: { type: Boolean, required: true, default: false },
    language: { type: String, required: true },
    aboutYourself: { type: String, required: false, validate: aboutYourselfValidators },
    translation: [{
        language: { type: String, required: true },
        aboutYourself: { type: String, required: false, validate: aboutYourselfValidators },
        _id: false
    }],
    temporaryToken: { type: String, required: true },
    resetToken: { type: String, required: false },
    permission: { type: String, required: true, default: 'contributor' },
    currentAvatar: { type: String, required: true, default: 'assets/img/avatars/default-avatar.jpg' },
    avatars: { type: Array, required: false }
});
//userSchema.index({ createdAt: -1 }); // schema level

// Middleware to ensure password is encrypted before saving user to database
userSchema.pre('save', function(next) {
    // Ensure password is new or modified before applying encryption
    if (!this.isModified('password'))
        return next();

    // Apply encryption
    bcrypt.hash(this.password, null, null, (err, hash) => {
        if (err) return next(err); // Ensure no errors
        this.password = hash; // Apply encryption to password
        next(); // Exit middleware
    });
});

// Methods to compare password to encrypted password upon login
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password); // Return comparison of login password to password in database (true or false)
};

// Export Module/Schema
module.exports = mongoose.model('User', userSchema);