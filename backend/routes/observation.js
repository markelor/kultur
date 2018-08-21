const User = require('../models/user'); // Import User Model Schema
const Observation = require('../models/observation'); // Import Observation Model Schema
const Place = require('../models/place'); // Import Place Model Schema
const Application = require('../models/application'); // Import Application Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const configAws = require('../config/aws'); // Import database configuration
const es = require('../translate/es'); // Import translate es
const eu = require('../translate/eu'); // Import translate eu
const en = require('../translate/en'); // Import translate en
const nodemailer = require('nodemailer');
const emailConfig = require('../config/email'); // Mongoose Email
var aws = require('aws-sdk');
var ObjectId = require('mongodb').ObjectId;
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
    /* ===============================================================
       CREATE NEW observation
    =============================================================== */
    router.post('/newObservation', (req, res) => {
        var language = req.body.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if observation createdBy was provided
            if (!req.body.createdBy) {
                res.json({ success: false, message: eval(language + '.newObservation.createdByProvidedError') }); // Return error
            } else {
                // Check if observation title was provided
                if (!req.body.title) {
                    res.json({ success: false, message: eval(language + '.newObservation.titleProvidedError') }); // Return error
                } else {
                    // Check if observation description was provided
                    if (!req.body.description) {
                        res.json({ success: false, message: eval(language + '.newObservation.descriptionProvidedError') }); // Return error message
                    } else {
                        const observation = new Observation({
                            createdBy: req.body.createdBy,
                            language: language,
                            title: req.body.title,
                            description: req.body.description,
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                            expiredAt: req.body.expiredAt
                        });
                        // Save observation into database
                        observation.save((err, observation) => {
                            // Check if error
                            if (err) {
                                // Check if error is a validation error
                                if (err.errors) {
                                    // Check if validation error is in the category field
                                    if (err.errors['title']) {
                                        res.json({ success: false, message: eval(language + err.errors['title'].message) }); // Return error message
                                    } else {
                                        if (err.errors['description']) {
                                            res.json({ success: false, message: eval(language + err.errors['description'].message) }); // Return error message
                                        } else {
                                            res.json({ success: false, message: err }); // Return general error message                                                           
                                        }
                                    }
                                } else {
                                    res.json({ success: false, message: eval(language + '.newObservation.saveError'), err }); // Return general error message
                                }
                            } else {
                                res.json({ success: true, message: eval(language + '.newObservation.success') }); // Return success message
                            }
                        });
                    }
                }
            }
        }
    });

    /* ===============================================================
       GET Observations
    =============================================================== */
    router.get('/getObservations/:language', (req, res) => {
        var language = req.params.language;
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            Observation.find({
                $or: [{ language: language }, { translation: { $elemMatch: { language: language } } }]
            }, function(err, observations) {
                if (err) {
                    // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                    var mailOptions = {
                        from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                        to: [emailConfig.email],
                        subject: ' Find one 1 get observations error ',
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
                    // Check if observation is in database
                    if (!observations) {
                        res.json({ success: false, message: eval(language + '.newObservation.observationsError') }); // Return error of no observations found
                    } else {
                        res.json({ success: true, observations: observations }); // Return success and place 
                    }
                }
            });
        }
    });
    /* ===============================================================
           GET Observation
        =============================================================== */
    router.get('/getObservation/:id/:username/:language', (req, res) => {
        var language = req.params.language;
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            if (!req.params.id) {
                res.json({ success: false, message: eval(language + '.getObservation.idProvidedError') }); // Return error
            } else {
                if (!req.params.username) {
                    res.json({ success: false, message: eval(language + '.getObservation.usernameProvidedError') }); // Return error
                } else {
                    // Look for logged in user in database to check if have appropriate access
                    User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
                        if (err) {
                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                            var mailOptions = {
                                from: "Fred Foo 👻 <" + emailConfig.email + ">", // sender address
                                to: [emailConfig.email],
                                subject: ' Find one 1 get observation error ',
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
                                res.json({ success: false, message: eval(language + '.getObservation.userError') }); // Return error
                            } else {
                                // Look for user in database
                                User.findOne({ username: req.params.username }, function(err, user) {
                                    if (err) {
                                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                        var mailOptions = {
                                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                            to: [emailConfig.email],
                                            subject: ' Find one 2 get observation error ',
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
                                            res.json({ success: false, message: eval(language + '.getObservation.userError') }); // Return error
                                        } else {
                                            var saveErrorPermission = false;
                                            // Check if is owner
                                            if (mainUser._id.toString() === user._id.toString()) {} else {
                                                // Check if the current permission is 'admin'
                                                if (mainUser.permission === 'admin') {
                                                    // Check if user making changes has access
                                                    if (user.permission === 'admin') {
                                                        saveErrorPermission = language + '.general.adminOneError';
                                                    } else {}
                                                } else {
                                                    // Check if the current permission is moderator
                                                    if (mainUser.permission === 'moderator') {
                                                        // Check if contributor making changes has access
                                                        if (user.permission === 'contributor') {} else {
                                                            saveErrorPermission = language + '.general.adminOneError';
                                                        }
                                                    } else {
                                                        saveErrorPermission = language + '.general.permissionError';
                                                    }
                                                }
                                            }
                                            //check saveError permision to save changes or not
                                            if (saveErrorPermission) {
                                                res.json({ success: false, message: eval(saveErrorPermission) }); // Return error
                                            } else {
                                                // Look for observation in database
                                                Observation.findOne({
                                                    $or: [{ language: language }, { translation: { $elemMatch: { language: language } } }],
                                                    _id: ObjectId(req.params.id)
                                                }, function(err, observation) {
                                                    if (err) {
                                                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                                        var mailOptions = {
                                                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                                            to: [emailConfig.email],
                                                            subject: ' Find one 3 get observation error ',
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
                                                        // Check if observation is in database
                                                        if (!observation) {
                                                            res.json({ success: false, message: eval(language + '.getObservation.observationError') }); // Return error of no observation found
                                                        } else {
                                                            res.json({ success: true, observation: observation }); // Return success and place 
                                                        }
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
        }
    });
    /* ===============================================================
           GET ALL user observations
        =============================================================== */
    router.get('/userObservations/:username/:language', (req, res) => {
        var language = req.params.language;
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            if (!req.params.username) {
                res.json({ success: false, message: eval(language + '.userObservations.usernameProvidedError') }); // Return error
            } else {
                Observation.find({
                    $or: [{ language: language }, { translation: { $elemMatch: { language: language } } }],
                    $or: [{ createdBy: req.params.username }, { translation: { $elemMatch: { createdBy: req.params.username } } }]
                }, function(err, observations) {
                    if (err) {
                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                        var mailOptions = {
                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                            to: [emailConfig.email],
                            subject: ' Find one 1 get user observations error ',
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
                        // Check if observation is in database
                        if (!observations) {
                            res.json({ success: false, message: eval(language + '.newObservation.observationsError') }); // Return error of no observations found
                        } else {
                            res.json({ success: true, observations: observations }); // Return success and place 
                        }
                    }
                });
            }
        }
    });

    /* ===============================================================
        Route to update/edit a observation
    =============================================================== */
    router.put('/editObservation', function(req, res) {
        var language = req.body.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if id was provided
            if (!req.body._id) {
                res.json({ success: false, message: eval(language + '.editObservation.idProvidedError') }); // Return error
            } else {
                // Check if createdBy was provided
                if (!req.body.createdBy) {
                    res.json({ success: false, message: eval(language + '.editObservation.createdByProvidedError') }); // Return error
                } else {
                    var editUser = req.body.createdBy; // Assign _id from observation to be editted to a variable
                    if (req.body.createdBy) var newObservationCreatedBy = req.body.createdBy; // Check if a change to createdBy was requested
                    if (req.body.observationTypeId) var newObservationTypeId = req.body.observationTypeId; // Check if a change to observationTypeId was requested
                    if (req.body.language) var newObservationLanguage = req.body.language; // Check if a change to language was requested
                    if (req.body.title) var newObservationTitle = req.body.title; // Check if a change to title was requested
                    if (req.body.description) var newObservationDescription = req.body.description; // Check if a change to description was requested
                    if (req.body.images) var newObservationImages = req.body.images; // Check if a change to imagesDescription was requeste
                    if (req.body.expiredAt) var newObservationExpiredAt = req.body.expiredAt; // Check if a change to expiredAt was requested
                    if (req.body.translation) var newObservationTranslation = req.body.translation; //Check if a change to translation was requested
                    // Look for logged in user in database to check if have appropriate access
                    User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
                        if (err) {
                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                            var mailOptions = {
                                from: "Fred Foo 👻 <" + emailConfig.email + ">", // sender address
                                to: [emailConfig.email],
                                subject: ' Find one 1 edit observation error ',
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
                                            subject: ' Find one 1 edit observation error ',
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
                                            // Check if is owner
                                            if (mainUser._id.toString() === user._id.toString()) {} else {
                                                // Check if the current permission is 'admin'
                                                if (mainUser.permission === 'admin') {
                                                    // Check if user making changes has access
                                                    if (user.permission === 'admin') {
                                                        saveErrorPermission = language + '.general.adminOneError';
                                                    } else {}
                                                } else {
                                                    // Check if the current permission is moderator
                                                    if (mainUser.permission === 'moderator') {
                                                        // Check if contributor making changes has access
                                                        if (user.permission === 'contributor') {} else {
                                                            saveErrorPermission = language + '.general.adminOneError';
                                                        }
                                                    } else {
                                                        saveErrorPermission = language + '.general.permissionError';
                                                    }
                                                }
                                            }
                                            //check saveError permision to save changes or not
                                            if (saveErrorPermission) {
                                                res.json({ success: false, message: eval(saveErrorPermission) }); // Return error
                                            } else {
                                                // Look for observation in database
                                                Observation.findOne({ _id: req.body._id }, function(err, observation) {
                                                    if (err) {
                                                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                                        var mailOptions = {
                                                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                                            to: [emailConfig.email],
                                                            subject: ' Find one 3 edit observation error ',
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
                                                        // Check if observation is in database
                                                        if (!observation) {
                                                            res.json({ success: false, message: eval(language + '.editUser.userError') }); // Return error
                                                        } else {
                                                            if (newObservationCreatedBy)
                                                                observation.createdBy = newObservationCreatedBy; // Assign new createdBy to observation in database
                                                            if (newObservationLanguage)
                                                                observation.language = newObservationLanguage; // Assign new language to observation in database
                                                            if (newObservationTitle)
                                                                observation.title = newObservationTitle; // Assign new title to observation in database
                                                            if (newObservationDescription)
                                                                observation.description = newObservationDescription; // Assign new description to observation in database
                                                            if (newObservationImages)
                                                                observation.images = newObservationImages; // Assign new imagesDescription to observation in database
                                                            if (newObservationExpiredAt)
                                                                observation.expiredAt = newObservationExpiredAt; // Assign new expiredAt to observation in database
                                                            if (newObservationTranslation)
                                                                observation.translation = newObservationTranslation; // Assign newTranslation to observation in database
                                                            observation.updatedAt = Date.now();
                                                            // Save observation into database
                                                            observation.save((err, observation) => {
                                                                // Check if error
                                                                if (err) {
                                                                    // Check if error is a validation error
                                                                    if (err.errors) {
                                                                        // Check if validation error is in the category field
                                                                        if (err.errors['title']) {
                                                                            res.json({ success: false, message: eval(language + err.errors['title'].message) }); // Return error message
                                                                        } else {
                                                                            if (err.errors['description']) {
                                                                                res.json({ success: false, message: eval(language + err.errors['description'].message) }); // Return error message
                                                                            } else {
                                                                                res.json({ success: false, message: err }); // Return general error message
                                                                            }
                                                                        }
                                                                    } else {
                                                                        res.json({ success: false, message: eval(language + '.editObservation.saveError'), err }); // Return general error message
                                                                    }
                                                                } else {
                                                                    res.json({ success: true, message: eval(language + '.editObservation.success') }); // Return success message
                                                                }
                                                            });
                                                        }
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
        }
    });
    /* ===============================================================
                Route to delete a observation
            =============================================================== */
    router.delete('/deleteObservation/:username/:id/:language', function(req, res) {
        var language = req.params.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if username was provided
            if (!req.params.username) {
                res.json({ success: false, message: eval(language + '.deleteObservation.usernameProvidedError') }); // Return error
            } else {
                // Check if observation id was provided
                if (!req.params.id) {
                    res.json({ success: false, message: eval(language + '.deleteObservation.idProvidedError') }); // Return error
                } else {
                    var deleteUser = req.params.username; // Assign the username from request parameters to a variable
                    // Look for logged in user in database to check if have appropriate access
                    User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
                        if (err) {
                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                            var mailOptions = {
                                from: "Fred Foo 👻 <" + emailConfig.email + ">", // sender address
                                to: [emailConfig.email],
                                subject: ' Find one 1 delete observation error ',
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
                                User.findOne({ username: deleteUser }, function(err, user) {
                                    if (err) {
                                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                        var mailOptions = {
                                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                            to: [emailConfig.email],
                                            subject: ' Find one 2 delete observation error ',
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
                                            // Check if is owner
                                            if (mainUser._id.toString() === user._id.toString()) {} else {
                                                // Check if the current permission is 'admin'
                                                if (mainUser.permission === 'admin') {
                                                    // Check if user making changes has access
                                                    if (user.permission === 'admin') {
                                                        saveErrorPermission = language + '.general.adminOneError';
                                                    } else {}
                                                } else {
                                                    // Check if the current permission is moderator
                                                    if (mainUser.permission === 'moderator') {
                                                        // Check if contributor making changes has access
                                                        if (user.permission === 'contributor') {} else {
                                                            saveErrorPermission = language + '.general.adminOneError';
                                                        }
                                                    } else {
                                                        saveErrorPermission = language + '.general.permissionError';
                                                    }
                                                }
                                            }
                                            //check saveError permision to save changes or not
                                            if (saveErrorPermission) {
                                                res.json({ success: false, message: eval(saveErrorPermission) }); // Return error
                                            } else {
                                                Application.find({
                                                    observations: ObjectId(req.params.id)
                                                }, function(err, applications) {
                                                    if (err) {
                                                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                                        var mailOptions = {
                                                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                                            to: [emailConfig.email],
                                                            subject: ' Find 3 delete application error ',
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
                                                        // Check if observation is in database
                                                        if (!applications) {
                                                            res.json({ success: false, message: eval(language + '.newObservation.observationsError') }); // Return error of no observations found
                                                        } else {
                                                            if (applications.length === 0) {
                                                                // Fine the observation that needs to be deleted
                                                                Observation.findOneAndRemove({ _id: req.params.id }, function(err, observation) {
                                                                    if (err) {
                                                                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                                                        var mailOptions = {
                                                                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                                                            to: [emailConfig.email],
                                                                            subject: ' Find one and remove for delete observation ',
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
                                                                                if (bucket === "observation-description") {
                                                                                    var currentUrlSplit = images[i].split("/");
                                                                                    let imageName = currentUrlSplit[currentUrlSplit.length - 1];
                                                                                    var urlSplit = imageName.split("%2F");
                                                                                    imagesKey.push({
                                                                                        Key: bucket + "/" + urlSplit[1]
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
                                                                                        subject: 'Error delete images observation',
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
                                                                        if (observation.images.length > 0) {
                                                                            deleteImages(observation.images, "observation-description");
                                                                        }
                                                                        for (var i = 0; i < observation.translation.length; i++) {
                                                                            if (observation.translation[i].images.description.length > 0) {
                                                                                deleteImages(observation.translation[i].images, "observation-description");
                                                                            }
                                                                        }
                                                                    }
                                                                });
                                                            } else {
                                                                res.json({ success: false, message: eval(language + '.deleteObservation.deleteError') }); // Return error
                                                            }
                                                            res.json({ success: true, applications: applications }); // Return success and place 
                                                        }
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
        }
    });

    return router;
};