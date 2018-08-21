const User = require('../models/user'); // Import User Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const configAws = require('../config/aws'); // Import database configuration
const config = require('../config/database'); // Import database configuration
const es = require('../translate/es'); // Import translate es
const eu = require('../translate/eu'); // Import translate eu
const en = require('../translate/en'); // Import translate en
const nodemailer = require('nodemailer');
const emailConfig = require('../config/email'); // Mongoose Email
var aws = require('aws-sdk');
module.exports = (router) => {
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        auth: {
            user: emailConfig.email,
            pass: emailConfig.password
        }
    });
    var s3 = new aws.S3(configAws);
    /* ==============
       Register Route
    ============== */
    router.post('/register', (req, res) => {
        var language = req.body.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if name was provided
            if (!req.body.name) {
                res.json({ success: false, message: eval(language + '.register.nameProvidedError') }); // Return error
            } else {
                // Check if email was provided
                if (!req.body.email) {
                    res.json({ success: false, message: eval(language + '.register.emailProvidedError') }); // Return error
                } else {
                    // Check if username was provided
                    if (!req.body.username) {
                        res.json({ success: false, message: eval(language + '.register.usernameProvidedError') }); // Return error
                    } else {
                        // Check if password was provided
                        if (!req.body.password) {
                            res.json({ success: false, message: eval(language + '.register.passwordProvidedError') }); // Return error
                        } else {
                            // Create the user object for insertion into database
                            let user = new User(); // Create new User object
                            user.username = req.body.username; // Save username from request to User object
                            user.password = req.body.password; // Save password from request to User object
                            user.email = req.body.email; // Save email from request to User object
                            user.name = req.body.name; // Save name from request to User object
                            user.language = req.body.language;
                            user.aboutYourself = req.body.aboutYourself;
                            user.temporaryToken = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' }); // Create a token for activating account through e-mail
                            // Save user to database
                            user.save((err) => {
                                // Check if error occured
                                if (err) {
                                    // Check if error is an error indicating duplicate account
                                    if (err.code === 11000) {
                                        res.json({ success: false, message: eval(language + '.register.duplicateError') }); // Return error
                                    } else {
                                        // Check if error is a validation error
                                        if (err.errors) {
                                            // Check if validation error is in the name field
                                            if (err.errors.name) {
                                                res.json({ success: false, message: eval(language + err.errors.name.message) }); // Return error
                                            } else {
                                                // Check if validation error is in the email field
                                                if (err.errors.email) {
                                                    res.json({ success: false, message: eval(language + err.errors.email.message) }); // Return error
                                                } else {
                                                    // Check if validation error is in the username field
                                                    if (err.errors.username) {
                                                        res.json({ success: false, message: eval(language + err.errors.username.message) }); // Return error
                                                    } else {
                                                        // Check if validation error is in the password field
                                                        if (err.errors.password) {
                                                            res.json({ success: false, message: eval(language + err.errors.password.message) }); // Return error
                                                        } else {
                                                            // Check if validation error is in the aboutYourself field
                                                            if (err.errors.aboutYourself) {
                                                                res.json({ success: false, message: eval(language + err.errors.aboutYourself.message) }); // Return error
                                                            } else {
                                                                res.json({ success: false, message: err }); // Return any other error not already covered
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        } else {
                                            res.json({ success: false, message: eval(language + '.register.saveError'), err }); // Return error if not related to validation
                                        }
                                    }
                                } else {
                                    // setup email data with unicode symbols
                                    let mailOptions = {
                                        from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                        to: [user.email, emailConfig.email], // list of receivers
                                        subject: eval(language + '.register.emailSubject'),
                                        text: eval(language + '.register.emailTextOne') + user.name + eval(language + '.register.emailTextTwo') + user.temporaryToken,
                                        html: eval(language + '.register.emailHtmlOne') + user.name + eval(language + '.register.emailHtmlTwo') + user.temporaryToken + eval(language + '.register.emailHtmlThree')
                                    };
                                    // send mail with defined transport object
                                    transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            return console.log(error);
                                        }
                                        console.log('Message %s sent: %s', info.messageId, info.response);
                                    });
                                    res.json({ success: true, message: eval(language + '.register.success') }); // Return success
                                }
                            });
                        }
                    }
                }
            }
        }
    });

    /* ============================================================
       Route to check if user's email is available for registration
    ============================================================ */
    router.get('/checkEmail/:email?/:language', (req, res) => {
        var language = req.params.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if email was provided in paramaters
            if (!req.params.email) {
                res.json({ success: false, message: eval(language + '.checkEmail.emailProvidedError') }); // Return error
            } else {
                // Search for user's e-mail in database;
                User.findOne({ email: req.params.email }, (err, user) => {
                    if (err) {
                        res.json({ success: false, message: err }); // Return connection error
                    } else {
                        // Check if user's e-mail is taken
                        if (user) {
                            res.json({ success: false, message: eval(language + '.checkEmail.emailTakenError') }); // Return as taken e-mail
                        } else {
                            res.json({ success: true, message: eval(language + '.checkEmail.success') }); // Return as available e-mail
                        }
                    }
                });
            }
        }
    });

    /* ===============================================================
       Route to check if user's username is available for registration
    =============================================================== */
    router.get('/checkUsername/:username?/:language', (req, res) => {
        var language = req.params.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if username was provided in paramaters
            if (!req.params.username) {
                res.json({ success: false, message: eval(language + '.checkUsername.usernameProvidedError') }); // Return error
            } else {
                // Look for username in database
                User.findOne({ username: req.params.username }, (err, user) => { // Check if connection error was found
                    if (err) {
                        res.json({ success: false, message: err }); // Return connection error
                    } else {
                        // Check if user's username was found
                        if (user) {
                            res.json({ success: false, message: eval(language + '.checkUsername.usernameTakenError') }); // Return as taken username
                        } else {
                            res.json({ success: true, message: eval(language + '.checkUsername.success') }); // Return as vailable username
                        }
                    }
                });
            }
        }
    });

    /* ========
    LOGIN ROUTE
    ======== */
    router.post('/login', (req, res) => {
        var loginUser = req.body.username;
        var language = req.body.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            if (!loginUser) {
                res.json({ success: false, message: eval(language + '.login.usernameProvidedError') }); // Return error
            } else {
                if (!req.body.password) {
                    res.json({ success: false, message: eval(language + '.login.passwordError') }); // Password was not provided
                } else {
                    User.findOne({ username: loginUser }).select('email username password active currentAvatar permission').exec(function(err, user) {
                        if (err) {
                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                            var mailOptions = {
                                from: 'Kultura, ' + emailConfig.email,
                                to: emailConfig.email,
                                subject: 'Error Logged',
                                text: 'The following error has been reported in Login part: ' + err,
                                html: 'The following error has been reported in the Login part:<br><br>' + err
                            };
                            // Function to send e-mail to myself
                            transporter.sendMail(mailOptions, function(err, info) {
                                if (err) {
                                    console.log(err); // If error with sending e-mail, log to console/terminal
                                } else {
                                    console.log(info); // Log success message to console if sent
                                    console.log(user.email); // Display e-mail that it was sent to
                                }
                            });
                            res.json({ success: false, message: eval(language + '.general.generalError') });
                        } else {
                            // Check if user is found in the database (based on username)           
                            if (!user) {
                                res.json({ success: false, message: eval(language + '.login.usernameError') }); // Username not found in database
                            } else {
                                // Check if user does exist, then compare password provided by user
                                var validPassword = user.comparePassword(req.body.password); // Check if password matches password provided by user 
                                if (!validPassword) {
                                    res.json({ success: false, message: eval(language + '.login.passwordValidError') }); // Password does not match password in database
                                } else if (!user.active) {
                                    res.json({ success: false, message: eval(language + '.login.activatedError'), expired: true }); // Account is not activated 
                                } else {
                                    const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' }); // Create a token for client
                                    res.json({
                                        success: true,
                                        message: eval(language + '.login.success'),
                                        token: token,
                                        user: {
                                            username: user.username,
                                            permission:user.permission,
                                            currentAvatar: user.currentAvatar
                                        }
                                    }); // Return success and token to frontend
                                }

                            }
                        }
                    });
                }
            }
        }
    });
    /* ===============================================================
           Route to activate the user's account 
       =============================================================== */
    router.put('/activate', (req, res) => {
        var language = req.body.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            if (!req.body.temporaryToken) {
                res.json({ success: false, message: eval(language + '.activate.temporaryTokenProvidedError') }); // Return error
            } else {
                User.findOne({ temporaryToken: req.body.temporaryToken }, (err, user) => {
                    if (err) {
                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                        let mailOptions = {
                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                            to: [emailConfig.email], // list of receivers
                            subject: 'Error Logged',
                            text: 'The following error has been reported in the adminFestApp Application: ' + err,
                            html: 'The following error has been reported in the adminFestApp Application:<br><br>' + err
                        };
                        // Function to send e-mail to myself
                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                console.log(err); // If error with sending e-mail, log to console/terminal
                            } else {
                                console.log(info); // Log success message to console if sent
                                console.log(user.email); // Display e-mail that it was sent to
                            }
                        });
                        res.json({ success: false, message: eval(language + '.general.generalError') });
                    } else {
                        var temporaryToken = req.body.temporaryToken; // Save the token from URL for verification 
                        // Function to verify the user's token
                        jwt.verify(temporaryToken, config.secret, (err, decoded) => {
                            if (err) {
                                res.json({ success: false, message: eval(language + '.activate.expiredError') }); // Token is expired
                            } else if (!user) {
                                res.json({ success: false, message: eval(language + '.activate.expiredError') }); // Token may be valid but does not match any user in the database
                            } else {
                                user.temporaryToken = false; // Remove temporary token
                                user.active = true; // Change account status to Activated
                                // Mongoose Method to save user into the database
                                user.save(function(err) {
                                    if (err) {
                                        console.log(err); // If unable to save user, log error info to console/terminal
                                    } else {
                                        // If save succeeds, create e-mail object
                                        var mailOptions = {
                                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                            to: [user.email, emailConfig.email],
                                            subject: eval(language + '.activate.emailSubject'),
                                            text: eval(language + '.activate.emailTextOne') + user.name + eval(language + '.activate.emailTextTwo'),
                                            html: eval(language + '.activate.emailHtmlOne') + user.name + eval(language + '.activate.emailHtmlTwo')
                                        };
                                        // Send e-mail object to user
                                        transporter.sendMail(mailOptions, function(err, info) {
                                            if (err) console.log(err); // If unable to send e-mail, log error info to console/terminal
                                        });
                                        res.json({ success: true, message: eval(language + '.activate.success') }); // Return success message to controller
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });

    /* =======================================================================
     Route to verify user credentials before re-sending a new activation link
    ========================================================================== */

    router.post('/resend', function(req, res) {
        var language = req.body.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if username was provided
            if (!req.body.username) {
                res.json({ success: false, message: eval(language + '.resend.usernameProvidedError') }); // Return error
            } else {
                // Check if password was provided
                if (!req.body.password) {
                    res.json({ success: false, message: eval(language + '.resend.passwordProvidedError') }); // No password was provided
                } else {
                    User.findOne({ username: req.body.username }).select('username password active').exec(function(err, user) {
                        if (err) {
                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                            let mailOptions = {
                                from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                to: [emailConfig.email], // list of receivers
                                subject: 'Error resend verify credentials',
                                text: 'The following error has been reported in the adminFestApp Application: ' + err,
                                html: 'The following error has been reported in the adminFestApp Application:<br><br>' + err
                            };
                            // Function to send e-mail to myself
                            transporter.sendMail(mailOptions, function(err, info) {
                                if (err) {
                                    console.log(err); // If error with sending e-mail, log to console/terminal
                                } else {
                                    console.log(info); // Log success message to console if sent
                                    console.log(user.email); // Display e-mail that it was sent to
                                }
                            });
                            res.json({ success: false, message: eval(language + '.general.generalError') });
                        } else {
                            // Check if username is found in database
                            if (!user) {
                                res.json({ success: false, message: eval(language + '.resend.userError') }); // Username does not match username found in database
                            } else {
                                var validPassword = user.comparePassword(req.body.password); // Password was provided. Now check if matches password in database
                                if (!validPassword) {
                                    res.json({ success: false, message: eval(language + '.resend.validPasswordError') }); // Password does not match password found in database
                                } else if (user.active) {
                                    res.json({ success: false, message: eval(language + '.resend.accountError') }); // Account is already activated
                                } else {
                                    res.json({ success: true, user: user });
                                }

                            }
                        }
                    });
                }
            }
        }
    });
    /* =======================================================================
      Route to send user a new activation link once credentials have been verified
    ========================================================================== */
    router.put('/resend', function(req, res) {
        var language = req.body.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if username was provided
            if (!req.body.username) {
                res.json({ success: false, message: eval(language + '.resend.usernameProvidedError') }); // Return error
            } else {
                User.findOne({ username: req.body.username }).select('username name email temporaryToken').exec(function(err, user) {
                    if (err) {
                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                        let mailOptions = {
                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                            to: [emailConfig.email], // list of receivers
                            subject: 'Error send new activation link',
                            text: 'The following error has been reported in the adminFestApp Application: ' + err,
                            html: 'The following error has been reported in the adminFestApp Application:<br><br>' + err
                        };
                        // Function to send e-mail to myself
                        transporter.sendMail(mailOptions, function(err, info) {
                            if (err) {
                                console.log(err); // If error with sending e-mail, log to console/terminal
                            } else {
                                console.log(info); // Log success message to console if sent
                                console.log(user.email); // Display e-mail that it was sent to
                            }
                        });
                        res.json({ success: false, message: eval(language + '.general.generalError') });
                    } else {
                        user.temporaryToken = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' }); // Create a token for activating account through e-mail
                        // Save user's new token to the database
                        user.save(function(err) {
                            if (err) {
                                console.log(err); // If error saving user, log it to console/terminal
                            } else {
                                // If user successfully saved to database, create e-mail object
                                let mailOptions = {
                                    from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                    to: [user.email, emailConfig.email], // list of receivers
                                    subject: eval(language + '.resend.emailSubject'),
                                    text: eval(language + '.resend.emailTextOne') + user.name + eval(language + '.resend.emailTextTwo') + user.temporaryToken,
                                    html: eval(language + '.resend.emailHtmlOne') + user.name + eval(language + '.resend.emailHtmlTwo') + user.temporaryToken + eval(language + '.resend.emailHtmlThree')
                                };
                                // Function to send e-mail to user
                                transporter.sendMail(mailOptions, function(err, info) {
                                    if (err) console.log(err); // If error in sending e-mail, log to console/terminal
                                });
                                res.json({ success: true, message: eval(language + '.resend.success') + user.email + '!' }); // Return success message to controller
                            }
                        });
                    }
                });
            }
        }
    });
    /* =======================================================================
      Route to send user's username to e-mail
    ========================================================================== */
    router.get('/resetUsername/:email/:language', function(req, res) {
        var language = req.params.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if email was provided
            if (!req.params.email) {
                res.json({ success: false, message: eval(language + '.resetUsername.emailProvidedError') }); // Return error
            } else {
                User.findOne({ email: req.params.email }).select('email name username').exec(function(err, user) {
                    if (err) {
                        res.json({ success: false, message: err }); // Error if cannot connect
                    } else {
                        if (!user) {
                            res.json({ success: false, message: eval(language + '.resetUsername.emailError') }); // Return error if e-mail cannot be found in database
                        } else {
                            // If e-mail found in database, create e-mail object
                            let mailOptions = {
                                from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                to: [user.email],
                                subject: eval(language + '.resetUsername.emailSubject'),
                                text: eval(language + '.resetUsername.emailTextOne') + user.name + eval(language + '.resetUsername.emailTextTwo') + user.username,
                                html: eval(language + '.resetUsername.emailHtmlOne') + user.name + eval(language + '.resetUsername.emailHtmlTwo') + user.username
                            };

                            // Function to send e-mail to user
                            transporter.sendMail(mailOptions, function(err, info) {
                                if (err) {
                                    console.log(err); // If error in sending e-mail, log to console/terminal
                                } else {
                                    console.log(info); // Log confirmation to console
                                }
                            });
                            res.json({ success: true, message: eval(language + '.resetUsername.success') }); // Return success message once e-mail has been sent
                        }
                    }
                });
            }
        }
    });
    /* =======================================================================
       Route to send reset link to the user
    ========================================================================== */

    router.put('/resetPassword', function(req, res) {
        var language = req.body.language;
        // Check if lamguage was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if username was provided
            if (!req.body.username) {
                res.json({ success: false, message: eval(language + '.resetPassword.usernameProvidedError') }); // Return error
            } else {
                User.findOne({ username: req.body.username }).select('username active email resetToken name').exec(function(err, user) {
                    if (err) {
                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                        let mailOptions = {
                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                            to: [emailConfig.email],
                            subject: 'Error reset password Request',
                            text: 'The following error has been reported in Kultura: ' + err,
                            html: 'The following error has been reported in Kultura:<br><br>' + err
                        };
                        // Function to send e-mail to myself
                        transporter.sendMail(mailOptions, function(err, info) {
                            if (err) {
                                console.log(err); // If error with sending e-mail, log to console/terminal
                            } else {
                                console.log(info); // Log success message to console if sent
                                console.log(user.email); // Display e-mail that it was sent to
                            }
                        });
                        res.json({ success: false, message: eval(language + '.general.generalError') });
                    } else {
                        if (!user) {
                            res.json({ success: false, message: eval(language + '.resetPassword.usernameError') }); // Return error if username is not found in database
                        } else if (!user.active) {
                            res.json({ success: false, message: eval(language + '.resetPassword.accountError') }); // Return error if account is not yet activated
                        } else {
                            user.resetToken = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' }); //New token to reset
                            // Save token to user in database
                            user.save(function(err) {
                                if (err) {
                                    res.json({ success: false, message: err }); // Return error if cannot connect
                                } else {
                                    // Create e-mail object to send to user
                                    var mailOptions = {
                                        from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                        to: [user.email],
                                        subject: eval(language + '.resetPassword.emailSubject'),
                                        text: eval(language + '.resetPassword.emailTextOne') + user.name + eval(language + '.resetPassword.emailTextTwo') + user.resetToken,
                                        html: eval(language + '.resetPassword.emailHtmlOne') + user.name + eval(language + '.resetPassword.emailHtmlTwo') + user.resetToken + eval(language + '.resetPassword.emailHtmlThree')
                                    };
                                    // Function to send e-mail to the user
                                    transporter.sendMail(mailOptions, function(err, info) {
                                        if (err) {
                                            console.log(err); // If error with sending e-mail, log to console/terminal
                                        } else {
                                            console.log(info); // Log success message to console
                                            console.log('sent to: ' + user.email); // Log e-mail 
                                        }
                                    });
                                    res.json({ success: true, message: eval(language + '.resetPassword.success') }); // Return success message
                                }
                            });
                        }
                    }
                });
            }
        }
    });
    /* =======================================================================
       Route to verify user's e-mail activation link
    ========================================================================== */
    router.get('/resetPassword/:token/:language', function(req, res) {
        var language = req.params.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if username was provided
            if (!req.params.token) {
                res.json({ success: false, message: eval(language + '.resetPassword.tokenProvidedError') }); // Return error
            } else {
                User.findOne({ resetToken: req.params.token }).select().exec(function(err, user) {
                    if (err) {
                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                        var mailOptions = {
                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                            to: [emailConfig.email],
                            subject: 'Error get password reset token',
                            text: 'The following error has been reported in Kultura: ' + err,
                            html: 'The following error has been reported in Kultura:<br><br>' + err
                        };
                        // Function to send e-mail to myself
                        transporter.sendMail(mailOptions, function(err, info) {
                            if (err) {
                                console.log(err); // If error with sending e-mail, log to console/terminal
                            } else {
                                console.log(info); // Log success message to console if sent
                                console.log(user.email); // Display e-mail that it was sent to
                            }
                        });
                        res.json({ success: false, message: eval(language + '.general.generalError') });
                    } else {
                        var token = req.params.token; // Save user's token from parameters to variable
                        // Function to verify token
                        jwt.verify(token, config.secret, function(err, decoded) {
                            if (err) {
                                res.json({ success: false, message: eval(language + '.resetPassword.expiredError') }); // Token has expired or is invalid
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: eval(language + '.resetPassword.expiredError') }); // Token is valid but not no user has that token anymore
                                } else {
                                    res.json({ success: true, user: user }); // Return user object to controller
                                }
                            }
                        });
                    }
                });
            }
        }
    });

    /* =======================================================================
       Save user's new password to database
    ========================================================================== */

    router.put('/savePassword', function(req, res) {
        var language = req.body.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if username was provided
            if (!req.body.username) {
                res.json({ success: false, message: eval(language + '.savePassword.usernameProvidedError') }); // Return error
            } else {
                // Check if password was provided
                if (!req.body.password) {
                    res.json({ success: false, message: eval(language + '.savePassword.passwordProvidedError') }); // No password was provided
                } else {
                    User.findOne({ username: req.body.username }).select('username email name password resetToken').exec(function(err, user) {
                        if (err) {
                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                            var mailOptions = {
                                from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                to: [emailConfig.email],
                                subject: 'Error saved reset password',
                                text: 'The following error has been reported in Kultura: ' + err,
                                html: 'The following error has been reported in Kultura:<br><br>' + err
                            };
                            // Function to send e-mail to myself
                            transporter.sendMail(mailOptions, function(err, info) {
                                if (err) {
                                    console.log(err); // If error with sending e-mail, log to console/terminal
                                } else {
                                    console.log(info); // Log success message to console if sent
                                    console.log(user.email); // Display e-mail that it was sent to
                                }
                            });
                            res.json({ success: false, message: eval(language + '.general.generalError') });
                        } else {
                            user.password = req.body.password; // Save user's new password to the user object
                            user.resetToken = false; // Clear user's resetToken 
                            // Save user's new data
                            user.save(function(err) {
                                if (err) {
                                    res.json({ success: false, message: err });
                                } else {
                                    // Create e-mail object to send to user
                                    var mailOptions = {
                                        from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                        to: [user.email],
                                        subject: eval(language + '.savePassword.emailSubject'),
                                        text: eval(language + '.savePassword.emailTextOne') + user.name + eval(language + '.savePassword.emailTextTwo'),
                                        html: eval(language + '.savePassword.emailHtmlOne') + user.name + eval(language + '.savePassword.emailHtmlTwo')
                                    };
                                    // Function to send e-mail to the user
                                    transporter.sendMail(mailOptions, function(err, info) {
                                        if (err) console.log(err); // If error with sending e-mail, log to console/terminal
                                    });
                                    res.json({ success: true, message: eval(language + '.savePassword.success') }); // Return success message
                                }
                            });
                        }
                    });
                }
            }
        }
    });
    /* ===============================================================
            Route to get all users images
        =============================================================== */
    router.get('/usersImages/:usernames/:language', function(req, res) {
        var language = req.params.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            if (!req.params.usernames) {
                res.json({ success: false, message: eval(language + '.usersImages.usernamesError') });
            } else {
                User.find({
                    username: { $in: JSON.parse(req.params.usernames) }
                }).select('username currentAvatar').exec((err, users) => {
                    if (err) {
                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                        var mailOptions = {
                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                            to: [emailConfig.email],
                            subject: ' Find 1 for management error ',
                            text: 'The following error has been reported in Kultura: ' + err,
                            html: 'The following error has been reported in Kultura:<br><br>' + err
                        };
                        // Function to send e-mail to myself
                        transporter.sendMail(mailOptions, function(err, info) {
                            if (err) {
                                console.log(err); // If error with sending e-mail, log to console/terminal
                            } else {
                                console.log(info); // Log success message to console if sent
                                console.log(user.email); // Display e-mail that it was sent to
                            }
                        });
                        res.json({ success: false, message: eval(language + '.general.generalError') });
                    } else {
                        res.json({ success: true, users: users }); // Return users, along with current user's permission
                    }
                });
            }
        }
    });
    /* ===============================================================
           GET ALL users search
        =============================================================== */
    router.get('/usersSearch/:search?/:language', (req, res) => {
        var language = req.params.language;
        var search = req.params.search;
        if (!language) {
            res.json({ success: false, message: "No se encontro el lenguaje" }); // Return error
        } else {
            if (!search) {
                res.json({ success: false, message: eval(language + '.usersSearch.searchTermProvidedError') }); // Return error
            } else {
                // Search database for all users posts
                User.find({
                    username: {
                        $regex: new RegExp(".*" + search + ".*", "i")
                    }
                }, (err, users) => {
                    // Check if error was found or not
                    if (err) {
                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                        var mailOptions = {
                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                            to: [emailConfig.email], // list of receivers
                            subject: ' Find 1 usersSearch error ',
                            text: 'The following error has been reported in the Kultura: ' + err,
                            html: 'The following error has been reported in the Kultura:<br><br>' + err
                        };
                        // Function to send e-mail to myself
                        transporter.sendMail(mailOptions, function(err, info) {
                            if (err) {
                                console.log(err); // If error with sending e-mail, log to console/terminal
                            } else {
                                console.log(info); // Log success message to console if sent
                                console.log(user.email); // Display e-mail that it was sent to
                            }
                        });
                        res.json({ success: false, message: eval(language + '.general.generalError') });
                    } else {
                        // Check if users were found in database
                        if (!users) {
                            res.json({ success: false, message: eval(language + '.usersSearch.usersError') }); // Return error of no users found
                        } else {
                            res.json({ success: true, users: users }); // Return success and users array
                        }
                    }
                }).sort({ '_id': -1 }); // Sort users from newest to oldest
            }
        }
    });

    /* ================================================
    MIDDLEWARE - Used to grab user's token from headers
    ================================================ */
    router.use((req, res, next) => {
        var language = req.headers['language'];
        var route = req.headers['route'];
        if (!language) {
            language = "es";
        }
        var token = req.headers['authorization']; // Create token found in headers
        if (req.path === '/allThemes/' + language && req.method === 'GET') {
            next();
        } else if (req.path === '/eventsSearch/' + route + language && req.method === 'GET') {
            next();
        } else if (req.path === '/getEvents/' + language && req.method === 'GET') {
            next()
        } else if (req.path === '/getEvent/' + route + language && req.method === 'GET') {
            next()
        } else if (req.path === '/getPlacesCoordinates/' + route + language && req.method === 'GET') {
            next()
        } else if (req.path === '/getApplicationEvents/' + route + language && req.method === 'GET') {
            next();
        } else if (req.path === '/getApplicationServices/' + route + language && req.method === 'GET') {
            next();
        } else if (req.path === '/getApplicationObservations/' + route + language && req.method === 'GET') {
            next();
        } else if (req.path === '/getComments/' + route + language && req.method === 'GET') {
            next()
        } else {
            // Check if token was found in headers
            if (!token) {
                res.json({ success: false, message: eval(language + '.headers.tokenError') }); // Return error
            } else {
                token = token.split(' ')[1];
                // Verify the token is valid
                jwt.verify(token, config.secret, (err, decoded) => {
                    // Check if error is expired or invalid
                    if (err) {
                        res.json({ success: false, authentication: false, message: eval(language + '.headers.validError') + err }); // Return error for token validation
                    } else {
                        req.decoded = decoded; // Create global variable to use in any request beyond
                        next(); // Exit middleware
                    }
                });
            }
        }

    });

    /* ===============================================================
       Route to provide the user with a new token to renew session
    =============================================================== */

    router.get('/renewToken/:username/:language', function(req, res) {
        var language = req.params.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if username was provided
            if (!req.params.username) {
                res.json({ success: false, message: eval(language + '.renewToken.usernameProvidedError') }); // Return error
            } else {
                User.findOne({ username: req.params.username }).select('username email').exec(function(err, user) {
                    if (err) {
                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                        var mailOptions = {
                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                            to: [emailConfig.email],
                            subject: 'Renew token error ',
                            text: 'The following error has been reported in Kultura: ' + err,
                            html: 'The following error has been reported in Kultura:<br><br>' + err
                        };
                        // Function to send e-mail to myself
                        transporter.sendMail(mailOptions, function(err, info) {
                            if (err) {
                                console.log(err); // If error with sending e-mail, log to console/terminal
                            } else {
                                console.log(info); // Log success message to console if sent
                                console.log(user.email); // Display e-mail that it was sent to
                            }
                        });
                        res.json({ success: false, message: eval(language + '.general.generalError') });
                    } else {
                        // Check if username was found in database
                        if (!user) {
                            res.json({ success: false, message: eval(language + '.renewToken.userError') }); // Return error
                        } else {
                            var newToken = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' }); // Give user a new token
                            res.json({ success: true, token: newToken }); // Return newToken in JSON object to controller
                        }
                    }
                });
            }
        }
    });
    /* ===============================================================
        Route to get the current user's permission level
    =============================================================== */

    router.get('/permission/:language', function(req, res) {
        var language = req.params.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            User.findOne({ _id: req.decoded.userId }, function(err, user) {
                if (err) {
                    // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                    var mailOptions = {
                        from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                        to: [emailConfig.email],
                        subject: ' Get permission error ',
                        text: 'The following error has been reported in Kultura: ' + err,
                        html: 'The following error has been reported in Kultura:<br><br>' + err
                    };
                    // Function to send e-mail to myself
                    transporter.sendMail(mailOptions, function(err, info) {
                        if (err) {
                            console.log(err); // If error with sending e-mail, log to console/terminal
                        } else {
                            console.log(info); // Log success message to console if sent
                            console.log(user.email); // Display e-mail that it was sent to
                        }
                    });
                    res.json({ success: false, message: eval(language + '.general.generalError') });
                } else {
                    // Check if username was found in database
                    if (!user) {
                        res.json({ success: false, message: eval(language + '.permission.userError') }); // Return an error
                    } else {
                        res.json({ success: true, permission: user.permission }); // Return the user's permission
                    }
                }
            });
        }
    });

    /* ===============================================================
        Route to get all users for management page
    =============================================================== */

    router.get('/management/:language', function(req, res) {
        var language = req.params.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            User.find({}, function(err, users) {
                if (err) {
                    // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                    var mailOptions = {
                        from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                        to: [emailConfig.email],
                        subject: ' Find 1 for management error ',
                        text: 'The following error has been reported in Kultura: ' + err,
                        html: 'The following error has been reported in Kultura:<br><br>' + err
                    };
                    // Function to send e-mail to myself
                    transporter.sendMail(mailOptions, function(err, info) {
                        if (err) {
                            console.log(err); // If error with sending e-mail, log to console/terminal
                        } else {
                            console.log(info); // Log success message to console if sent
                            console.log(user.email); // Display e-mail that it was sent to
                        }
                    });
                    res.json({ success: false, message: eval(language + '.general.generalError') });
                } else {
                    User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
                        if (err) {
                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                            var mailOptions = {
                                from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                to: [emailConfig.email],
                                subject: ' Find one 2 for management error ',
                                text: 'The following error has been reported in Kultura: ' + err,
                                html: 'The following error has been reported in Kultura:<br><br>' + err
                            };
                            // Function to send e-mail to myself
                            transporter.sendMail(mailOptions, function(err, info) {
                                if (err) {
                                    console.log(err); // If error with sending e-mail, log to console/terminal
                                } else {
                                    console.log(info); // Log success message to console if sent
                                    console.log(user.email); // Display e-mail that it was sent to
                                }
                            });
                            res.json({ success: false, message: eval(language + '.general.generalError') });
                        } else {
                            // Check if logged in user was found in database
                            if (!mainUser) {
                                res.json({ success: false, message: eval(language + '.management.userError') }); // Return error
                            } else {
                                // Check if user has editing/deleting privileges 
                                if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                                    // Check if users were retrieved from database
                                    if (!users) {
                                        res.json({ success: false, message: eval(language + '.management.usersError') }); // Return error
                                    } else {
                                        res.json({ success: true, users: users, permission: mainUser.permission }); // Return users, along with current user's permission
                                    }
                                } else {
                                    res.json({ success: false, message: eval(language + '.general.permissionError') }); // Return access error
                                }
                            }
                        }
                    });
                }
            });
        }
    });

    /* ===============================================================
        Route to delete a user
    =============================================================== */
    router.delete('/management/:username/:language', function(req, res) {
        var language = req.params.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if username was provided
            if (!req.params.username) {
                res.json({ success: false, message: eval(language + '.management.usernameProvidedError') }); // Return error
            } else {
                var deleteUser = req.params.username; // Assign the username from request parameters to a variable
                User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
                    if (err) {
                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                        var mailOptions = {
                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                            to: [emailConfig.email],
                            subject: ' Find one for delete user ',
                            text: 'The following error has been reported in Kultura: ' + err,
                            html: 'The following error has been reported in Kultura:<br><br>' + err
                        };
                        // Function to send e-mail to myself
                        transporter.sendMail(mailOptions, function(err, info) {
                            if (err) {
                                console.log(err); // If error with sending e-mail, log to console/terminal
                            } else {
                                console.log(info); // Log success message to console if sent
                                console.log(user.email); // Display e-mail that it was sent to
                            }
                        });
                        res.json({ success: false, message: eval(language + '.general.generalError') });
                    } else {
                        // Check if current user was found in database
                        if (!mainUser) {
                            res.json({ success: false, message: eval(language + '.management.userError') }); // Return error
                        } else {
                            // Look for user in database
                            User.findOne({ username: deleteUser }, function(err, user) {
                                if (err) {
                                    // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                    var mailOptions = {
                                        from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                        to: [emailConfig.email],
                                        subject: ' Find one 2 delete event error ',
                                        text: 'The following error has been reported in Kultura: ' + err,
                                        html: 'The following error has been reported in Kultura:<br><br>' + err
                                    }; // Function to send e-mail to myself
                                    transporter.sendMail(mailOptions, function(err, info) {
                                        if (err) {
                                            console.log(err); // If error with sending e-mail, log to console/terminal
                                        } else {
                                            console.log(info); // Log success message to console if sent
                                            console.log(user.email); // Display e-mail that it was sent to
                                        }
                                    });
                                    res.json({ success: false, message: eval(language + '.general.generalError') });
                                } else {
                                    // Check if user is in database
                                    if (!user) {
                                        res.json({ success: false, message: eval(language + '.editUser.userError') }); // Return error
                                    } else {
                                        var saveErrorPermission = false;
                                        // Check if the current permission is 'admin'
                                        if (mainUser.permission === 'admin') {
                                            // Check if user making changes has access
                                            if (user.permission === 'admin') {
                                                saveErrorPermission = language + '.general.adminOneError';
                                            }
                                        }
                                        //check saveError permision to save changes or not
                                        if (saveErrorPermission) {
                                            res.json({ success: false, message: eval(saveErrorPermission) }); // Return error
                                        } else {
                                            // Fine the user that needs to be deleted
                                            User.findOneAndRemove({ username: deleteUser }, function(err, user) {
                                                if (err) {
                                                    // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                                    var mailOptions = {
                                                        from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                                        to: [emailConfig.email],
                                                        subject: ' Find one and remove for delete user ',
                                                        text: 'The following error has been reported in Kultura: ' + err,
                                                        html: 'The following error has been reported in Kultura:<br><br>' + err
                                                    };
                                                    // Function to send e-mail to myself
                                                    transporter.sendMail(mailOptions, function(err, info) {
                                                        if (err) {
                                                            console.log(err); // If error with sending e-mail, log to console/terminal
                                                        } else {
                                                            console.log(info); // Log success message to console if sent
                                                            console.log(user.email); // Display e-mail that it was sent to
                                                        }
                                                    });
                                                    res.json({ success: false, message: eval(language + '.general.generalError') });
                                                } else {
                                                    function deleteImages(images, bucket) {
                                                        var imagesKey = [];
                                                        for (var i = 0; i < images.length; i++) {
                                                            if (bucket === "user-profile") {
                                                                var currentUrlSplit = images[i].split("/");
                                                                let imageName = currentUrlSplit[currentUrlSplit.length - 1];
                                                                var urlSplit = imageName.split("%2F");
                                                                imagesKey.push({
                                                                    Key: bucket + "/" + urlSplit[0]
                                                                });
                                                            }
                                                        }
                                                        s3.deleteObjects({
                                                            Bucket: "culture-bucket",
                                                            Delete: {
                                                                Objects: imagesKey,
                                                                Quiet: false
                                                            }
                                                        }, function(err, data) {
                                                            if (err) {
                                                                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                                                var mailOptions = {
                                                                    from: emailConfig.email,
                                                                    to: emailConfig.email,
                                                                    subject: 'Error delete images user',
                                                                    text: 'The following error has been reported in File Upload part: ' + 'Date:' + Date.now().toString() + err,
                                                                    html: 'The following error has been reported in the File Upload part:<br><br>' + 'Date:' + Date.now().toString() + err
                                                                };
                                                                // Function to send e-mail to myself
                                                                transporter.sendMail(mailOptions, function(err, info) {
                                                                    if (err) {
                                                                        console.log(err); // If error with sending e-mail, log to console/terminal
                                                                    } else {
                                                                        console.log(info); // Log success message to console if sent
                                                                        console.log(user.email); // Display e-mail that it was sent to
                                                                    }
                                                                });
                                                                res.json({ success: false, message: eval(language + '.fileUpload.deleteError') });
                                                            } else {}
                                                        });
                                                    }
                                                    if (user.avatars.length > 0) {
                                                        deleteImages(user.avatars, "user-profile");
                                                    }
                                                    res.json({ success: true }); // Return success status
                                                }
                                            });

                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });

    /* ===============================================================
        Route to update/edit a user
    =============================================================== */

    router.put('/edit', function(req, res) {
        var language = req.body.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if username was provided
            if (!req.body.username) {
                res.json({ success: false, message: eval(language + '.editUser.usernameProvidedError') }); // Return error
            } else {
                var editUser = req.body.username; // Assign usernmae from user to be editted to a variable
                if (req.body.name) var newName = req.body.name; // Check if a change to name was requested
                if (req.body.username) var newUsername = req.body.username; // Check if a change to username was requested
                if (req.body.email) var newEmail = req.body.email; // Check if a change to e-mail was requested
                if (req.body.aboutYourself) var newAboutYourself = req.body.aboutYourself; // Check if a change to aboutYourself was requested
                if (req.body.permission) var newPermission = req.body.permission; // Check if a change to permission was requested
                if (req.body.currentAvatar) var newCurrentAvatar = req.body.currentAvatar; // Check if a change to currentAvatar was requested
                if (req.body.avatars) var newAvatars = req.body.avatars; // Check if a change to avatars was requested
                // Look for logged in user in database to check if have appropriate access
                User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
                    if (err) {
                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                        var mailOptions = {
                            from: "Fred Foo 👻 <" + emailConfig.email + ">", // sender address
                            to: [emailConfig.email],
                            subject: ' Find one 1 edit user error ',
                            text: 'The following error has been reported in Kultura: ' + err,
                            html: 'The following error has been reported in Kultura:<br><br>' + err
                        };
                        // Function to send e-mail to myself
                        transporter.sendMail(mailOptions, function(err, info) {
                            if (err) {
                                console.log(err); // If error with sending e-mail, log to console/terminal
                            } else {
                                console.log(info); // Log success message to console if sent
                                console.log(user.email); // Display e-mail that it was sent to
                            }
                        });
                        res.json({ success: false, message: eval(language + '.general.generalError') });
                    } else {
                        // Check if logged in user is found in database
                        if (!mainUser) {
                            res.json({ success: false, message: eval(language + '.editUser.userError') }); // Return error
                        } else {

                            // Look for user in database
                            User.findOne({ username: editUser }, function(err, user) {
                                if (err) {
                                    // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                    var mailOptions = {
                                        from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                        to: [emailConfig.email],
                                        subject: ' Find one 2 edit user error ',
                                        text: 'The following error has been reported in Kultura: ' + err,
                                        html: 'The following error has been reported in Kultura:<br><br>' + err
                                    }; // Function to send e-mail to myself
                                    transporter.sendMail(mailOptions, function(err, info) {
                                        if (err) {
                                            console.log(err); // If error with sending e-mail, log to console/terminal
                                        } else {
                                            console.log(info); // Log success message to console if sent
                                            console.log(user.email); // Display e-mail that it was sent to
                                        }
                                    });
                                    res.json({ success: false, message: eval(language + '.general.generalError') });
                                } else {
                                    // Check if user is in database
                                    if (!user) {
                                        res.json({ success: false, message: eval(language + '.editUser.userError') }); // Return error
                                    } else {
                                        // Check if person making changes has appropriate access
                                        if (mainUser.permission === 'admin' || mainUser.permission === 'moderator' || mainUser._id.toString() === user._id.toString()) {
                                            if (newName)
                                                user.name = newName; // Assign new name to user in database
                                            if (newUsername)
                                                user.username = newUsername; // Assign new username to user in database
                                            if (newEmail)
                                                user.email = newEmail; // Assign new email to user in database
                                            if (newAboutYourself)
                                                user.aboutYourself = newAboutYourself; // Assign new aboutYourself to user in database
                                            if (newCurrentAvatar)
                                                user.currentAvatar = newCurrentAvatar; // Assign new avatars to user in database
                                            if (newAvatars)
                                                user.avatars = newAvatars; // Assign new avatars to user in database
                                            var saveErrorPermission;
                                            if (newPermission) {
                                                // Check if attempting to set the contributor permission
                                                if (newPermission === 'contributor') {
                                                    // Check the current permission is an admin
                                                    if (mainUser.permission === 'admin') {
                                                        // Check if user making changes has access
                                                        if (user.permission === 'admin') {
                                                            saveErrorPermission = language + '.general.adminOneError';
                                                        } else {
                                                            user.permission = newPermission; // Assign new permission to user
                                                        }
                                                    } else {
                                                        saveErrorPermission = language + '.general.adminOneError';
                                                    }
                                                }
                                                // Check if attempting to set the 'moderator' permission
                                                if (newPermission === 'moderator') {
                                                    // Check if the current permission is 'admin'
                                                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                                                        // Check if user making changes has access
                                                        if (user.permission === 'admin' || user.permission === 'moderator') {
                                                            saveErrorPermission = language + '.general.adminOneError';
                                                        } else {
                                                            user.permission = newPermission; // Assign new permission
                                                        }
                                                    }
                                                }

                                                // Check if assigning the 'admin' permission
                                                if (newPermission === 'admin') {
                                                    // Check if logged in user has access
                                                    if (mainUser.permission === 'admin') {
                                                        if (user.permission === 'admin')
                                                            saveErrorPermission = language + '.general.adminTwoError';
                                                        else {
                                                            user.permission = newPermission; // Assign new permission
                                                        }
                                                    } else {
                                                        saveErrorPermission = language + '.general.adminTwoError';
                                                    }
                                                }
                                            }
                                            //check saveError permision to save changes or not
                                            if (saveErrorPermission) {
                                                res.json({ success: false, message: eval(saveErrorPermission) }); // Return error
                                            } else {
                                                // Save changes
                                                user.save(function(err) {
                                                    if (err) {
                                                        // Check if error is an error indicating duplicate account
                                                        if (err.code === 11000) {
                                                            res.json({ success: false, message: eval(language + '.register.duplicateError') }); // Return error
                                                        } else {
                                                            // Check if error is a validation error
                                                            if (err.errors) {
                                                                // Check if validation error is in the name field
                                                                if (err.errors.name) {
                                                                    res.json({ success: false, message: eval(language + err.errors.name.message) }); // Return error
                                                                } else {
                                                                    // Check if validation error is in the email field
                                                                    if (err.errors.email) {
                                                                        res.json({ success: false, message: eval(language + err.errors.email.message) }); // Return error
                                                                    } else {
                                                                        // Check if validation error is in the username field
                                                                        if (err.errors.username) {
                                                                            res.json({ success: false, message: eval(language + err.errors.username.message) }); // Return error
                                                                        } else {
                                                                            // Check if validation error is in the password field
                                                                            if (err.errors.password) {
                                                                                res.json({ success: false, message: eval(language + err.errors.password.message) }); // Return error
                                                                            } else {
                                                                                // Check if validation error is in the aboutYourself field
                                                                                if (err.errors.aboutYourself) {
                                                                                    res.json({ success: false, message: eval(language + err.errors.aboutYourself.message) }); // Return error
                                                                                } else {
                                                                                    res.json({ success: false, message: err }); // Return any other error not already covered
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            } else {
                                                                res.json({ success: false, message: eval(language + '.register.saveError'), err }); // Return error if not related to validation
                                                            }
                                                        }

                                                    } else {
                                                        res.json({ success: true, message: eval(language + '.editUser.nameUpdated') }); // Return success message
                                                    }
                                                });
                                            }
                                        } else {
                                            res.json({ success: false, message: eval(language + '.general.permissionError') }); // Return error
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });

    /* ===============================================================
       Route to get user's authentication data
    =============================================================== */
    router.get('/authentication/:language', (req, res) => {
        var language = req.params.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Search for user in database
            User.findOne({ _id: req.decoded.userId }).select('username email currentAvatar').exec((err, user) => {
                // Check if error connecting
                if (err) {
                    res.json({ success: false, message: err }); // Return error
                } else {
                    // Check if user was found in database
                    if (!user) {
                        res.json({ success: false, message: eval(language + '.authentication.userError') }); // Return error
                    } else {
                        res.json({ success: true, user: user }); // Return success, send user object to frontend for authentication
                    }
                }
            });
        }
    });
    /* ===============================================================
       Route to get user's profile
    =============================================================== */
    router.get('/profile/:username/:language', (req, res) => {
        var language = req.params.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if username was passed in the parameters
            if (!req.params.username) {
                res.json({ success: false, message: eval(language + '.authentication.usernameProvidedError') });
            } else {
                // Look for logged in user in database to check if have appropriate access
                User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
                    if (err) {
                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                        var mailOptions = {
                            from: "Fred Foo 👻 <" + emailConfig.email + ">", // sender address
                            to: [emailConfig.email],
                            subject: ' Find one 1 profile error ',
                            text: 'The following error has been reported in Kultura: ' + err,
                            html: 'The following error has been reported in Kultura:<br><br>' + err
                        };
                        // Function to send e-mail to myself
                        transporter.sendMail(mailOptions, function(err, info) {
                            if (err) {
                                console.log(err); // If error with sending e-mail, log to console/terminal
                            } else {
                                console.log(info); // Log success message to console if sent
                                console.log(user.email); // Display e-mail that it was sent to
                            }
                        });
                        res.json({ success: false, message: eval(language + '.general.generalError') });
                    } else {
                        // Check if logged in user is found in database
                        if (!mainUser) {
                            res.json({ success: false, message: eval(language + '.editUser.userError') }); // Return error
                        } else {
                            // Check if person making changes has appropriate access
                            // Look for user in database
                            User.findOne({ username: req.params.username }).select('username email currentAvatar avatars').exec((err, user) => {
                                if (err) {
                                    // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                    var mailOptions = {
                                        from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                        to: [emailConfig.email],
                                        subject: ' Find one 2 profile error',
                                        text: 'The following error has been reported in Kultura: ' + err,
                                        html: 'The following error has been reported in Kultura:<br><br>' + err
                                    }; // Function to send e-mail to myself
                                    transporter.sendMail(mailOptions, function(err, info) {
                                        if (err) {
                                            console.log(err); // If error with sending e-mail, log to console/terminal
                                        } else {
                                            console.log(info); // Log success message to console if sent
                                            console.log(user.email); // Display e-mail that it was sent to
                                        }
                                    });
                                    res.json({ success: false, message: eval(language + '.general.generalError') });
                                } else {
                                    // Check if user is in database
                                    if (!user) {
                                        res.json({ success: false, message: eval(language + '.editUser.userError') }); // Return error
                                    } else {
                                        if (mainUser.permission === 'admin' || mainUser._id.toString() === user._id.toString()) {
                                            res.json({ success: true, user: user }); // Return success, send user object to frontend for profile

                                        } else {
                                            res.json({ success: false, message: eval(language + '.general.permissionError') }); // Return error
                                        }
                                    }
                                }
                            });

                        }
                    }
                });
            }
        }
    });
    /* ===============================================================
       Route to get user's public profile data
    =============================================================== */
    router.get('/publicProfile/:username/:language', (req, res) => {
        var language = req.params.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if username was passed in the parameters
            if (!req.params.username) {
                res.json({ success: false, message: 'No username was provided' }); // Return error message
            } else {
                // Check the database for username
                User.findOne({ username: req.params.username }).select('username email').exec((err, user) => {
                    // Check if error was found
                    if (err) {
                        res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                    } else {
                        // Check if user was found in the database
                        if (!user) {
                            res.json({ success: false, message: 'Username not found.' }); // Return error message
                        } else {
                            res.json({ success: true, user: user }); // Return the public user's profile data
                        }
                    }
                });
            }
        }
    });



    return router; // Return router object to main index.js
}