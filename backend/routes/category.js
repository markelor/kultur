const User = require('../models/user'); // Import User Model Schema
const Category = require('../models/category'); // Import Category Model Schema
const Event = require('../models/event'); // Import Event Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const configAws = require('../config/aws'); // Import database configuration
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
    /* ===============================================================
       CREATE NEW category
    =============================================================== */
    router.post('/newCategory', (req, res) => {
        var language = req.body.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if category title was provided
            if (!req.body.title) {
                res.json({ success: false, message: eval(language + '.newCategory.titleProvidedError') }); // Return error
            } else {
                // Check if category description was provided
                if (!req.body.description) {
                    res.json({ success: false, message: eval(language + '.newCategory.descriptionProvidedError') }); // Return error message
                } else {
                    if (!req.body.parentId) {
                        req.body.parentId = null;
                    }
                    const category = new Category({
                        firstParentId: req.body.firstParentId,
                        parentId: req.body.parentId,
                        level: req.body.level,
                        language: language,
                        title: req.body.title,
                        description: req.body.description,
                        icons: req.body.icons,
                        createdAt: Date.now(),
                        updatedAt: Date.now()
                    });
                    // Save category into database
                    category.save((err) => {
                        // Check if error
                        if (err) {
                            console.log(err);
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
                                res.json({ success: false, message: eval(language + '.newCategory.saveError'), err }); // Return general error message
                            }
                        } else {
                            res.json({ success: true, message: eval(language + '.newCategory.success') }); // Return success message
                        }
                    });

                }
            }
        }
    });

    /* ===============================================================
       GET Categories
    =============================================================== */
    router.get('/getCategories/:language', (req, res) => {
        var language = req.params.language;
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            Category.find({
                $or: [{ language: language }, { translation: { $elemMatch: { language: language } } }]
            }).sort({ '_id': 1 }).exec((err, categories) => {
                // Check if error was found or not
                if (err) {
                    // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                    var mailOptions = {
                        from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                        to: [emailConfig.email], // list of receivers
                        subject: ' Find 1 categories category error ',
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
                    // Check if categories were found in database
                    if (!categories) {
                        res.json({ success: false, message: eval(language + '.newCategory.categoriesError') }); // Return error of no categories found
                    } else {
                        res.json({ success: true, categories: categories }); // Return success and categories array
                    }
                }
            }); // Sort categories from newest to oldest

        }

    });
    /* ===============================================================
       GET child categories
    =============================================================== */
    router.get('/childCategories/:id/:language', (req, res) => {
        var language = req.params.language;
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            if (!req.params.id) {
                res.json({ success: false, message: eval(language + '.newCategory.idProvidedError') }); // Return error
            } else {
                if (req.params.id === "null") {
                    req.params.id = null;
                }
                Category.find({
                    language: language,
                    parentId: req.params.id
                }).sort({ '_id': 1 }).exec((err, categories) => {
                    // Check if error was found or not
                    if (err) {
                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                        var mailOptions = {
                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                            to: [emailConfig.email], // list of receivers
                            subject: ' Find 1 categories category error ',
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
                        // Check if categories were found in database
                        if (!categories) {
                            res.json({ success: false, message: eval(language + '.newCategory.categoriesError') }); // Return error of no categories found
                        } else {
                            res.json({ success: true, categories: categories }); // Return success and categories array
                        }
                    }
                }); // Sort categories from newest to oldest

            }
        }

    });
    /* ===============================================================
        Route to update/edit a category
    =============================================================== */
    router.put('/editCategory', (req, res) => {
        var language = req.body.language;
        if (req.body.firstParentId) var newFirstParentId = req.body.firstParentId; // Check if a change to firstParentId was requested
        if (req.body.parentId) {}
        var newParentId = req.body.parentId; // Check if a change to parentId was requested
        if (req.body.level || req.body.level === 0) var newLevel = req.body.level; // Check if a change to level was requested
        if (req.body.title) var newTitle = req.body.title; // Check if a change to title was requested
        if (req.body.description) var newDescription = req.body.description; // Check if a change to description was requested
        if (req.body.icons) var newIcons = req.body.icons; // Check if a change to icons was requested
        if (req.body.translation) var newTranslation = req.body.translation; //Check if a change to translation was requested
        // Check if id was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            if (!req.body._id) {
                res.json({ success: false, message: eval(language + '.editCategory.idProvidedError') }); // Return error message
            } else {
                // Check if id exists in database
                Category.findOne({
                    _id: req.body._id
                }, (err, category) => {
                    // Check if id is a valid ID
                    if (err) {
                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                        var mailOptions = {
                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                            to: [emailConfig.email], // list of receivers
                            subject: ' Find one 1 edit category error ',
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
                        // Check if id was found in the database
                        if (!category) {
                            res.json({ success: false, message: eval(language + '.editCategory.categoryError') }); // Return error message
                        } else {
                            // Check who user is that is requesting caregory update
                            User.findOne({ _id: req.decoded.userId }, (err, user) => {
                                // Check if error was found
                                if (err) {
                                    // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                    var mailOptions = {
                                        from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                        to: [emailConfig.email], // list of receivers
                                        subject: ' Find one 2 edit category error ',
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
                                    // Check if user was found in the database
                                    if (!user) {
                                        res.json({ success: false, message: eval(language + '.editCategory.userError') }); // Return error message
                                    } else {
                                        if (user.permission !== 'admin') {
                                            res.json({ success: false, message: eval(language + '.editCategory.permissionError') }); // Return error message
                                        } else {
                                            if (newFirstParentId) category.firstParentId = newFirstParentId; // Assign new firstParentId to category in database
                                            if (newParentId) {
                                                category.parentId = newParentId;
                                            } else {
                                                category.parentId = null;
                                            }
                                            // Assign new parentId to category in database
                                            if (newLevel || newLevel === 0) category.level = newLevel; // Assign new level to category in database
                                            if (newTitle) category.title = newTitle; // Assign new title to category in database
                                            if (newDescription) category.description = newDescription; // Assign new description to category in database
                                            if (newIcons) category.icons = newIcons; // Assign new icons to category in database
                                            if (newTranslation) category.translation = newTranslation; // Assign new translation to category in database
                                            category.save((err) => {
                                                if (err) {
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
                                                        res.json({ success: false, message: eval(language + '.editCategory.saveError'), err }); // Return general error message
                                                    }
                                                } else {
                                                    res.json({ success: true, message: eval(language + '.editCategory.success') }); // Return success message
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
            Route to delete a category
        =============================================================== */
    router.delete('/deleteCategory/:id/:language', function(req, res) {
        var language = req.params.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if category id was provided
            if (!req.params.id) {
                res.json({ success: false, message: eval(language + '.deleteCategory.idProvidedError') }); // Return error
            } else {
                // Look for logged in user in database to check if have appropriate access
                User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
                    if (err) {
                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                        var mailOptions = {
                            from: "Fred Foo 👻 <" + emailConfig.email + ">", // sender address
                            to: [emailConfig.email],
                            subject: ' Find one 1 delete category error ',
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
                            var saveErrorPermission = false;
                            // Check if the current permission is 'admin'
                            if (mainUser.permission === 'admin') {} else {
                                saveErrorPermission = language + '.general.permissionError';
                            }
                            //check saveError permision to save changes or not
                            if (saveErrorPermission) {
                                res.json({ success: false, message: eval(saveErrorPermission) }); // Return error
                            } else {
                                Category.findOne({
                                    _id: req.params.id
                                }, function(err, category) {
                                    if (err) {
                                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                        var mailOptions = {
                                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                            to: [emailConfig.email],
                                            subject: ' Find 2 delete category error ',
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
                                        if (!category) {
                                            res.json({ success: false, message: eval(language + '.newObservation.observationsError') }); // Return error of no observations found
                                        } else {
                                            Event.find({
                                                categoryId: req.params.id
                                            }, function(err, events) {
                                                if (err) {
                                                    // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                                    var mailOptions = {
                                                        from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                                        to: [emailConfig.email],
                                                        subject: ' Find 3 delete event error ',
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
                                                    if (!events) {
                                                        res.json({ success: false, message: eval(language + '.newObservation.observationsError') }); // Return error of no observations found
                                                    } else {
                                                        if (events.length === 0) {
                                                            function deleteCategory() {
                                                                Category.findOneAndRemove({ _id: req.params.id }, function(err, category) {
                                                                    if (err) {
                                                                        console.log(err);
                                                                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                                                        var mailOptions = {
                                                                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                                                            to: [emailConfig.email],
                                                                            subject: ' Find one and remove for delete category ',
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
                                                                        res.json({ success: true, message: eval(language + '.deleteCategory.success') }); // Return success message

                                                                        function deleteImages(images, bucket) {
                                                                            var imagesKey = [];
                                                                            for (var i = 0; i < images.length; i++) {
                                                                                if (bucket === "category-icon") {
                                                                                    var currentUrlSplit = images[i].url.split("/");
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
                                                                                        subject: 'Error delete images category',
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
                                                                        if (category.icons.length > 0) {
                                                                            deleteImages(category.icons, "category-icon");
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                            if (category.parentId) {
                                                                //se if is last child
                                                                Category.find({
                                                                    parentId: req.params.id
                                                                }, function(err, categories) {
                                                                    if (err) {
                                                                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                                                        var mailOptions = {
                                                                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                                                            to: [emailConfig.email],
                                                                            subject: ' Find 4 delete categories error ',
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
                                                                        if (!categories) {
                                                                            res.json({ success: false, message: eval(language + '.newObservation.observationsError') }); // Return error of no observations found
                                                                        } else {
                                                                            if (categories.length === 0) {
                                                                                deleteCategory();
                                                                            } else {
                                                                                Category.updateMany({ parentId: req.params.id }, { $set: { parentId: category.parentId, level: category.level } }, function(err, res) {
                                                                                    if (err) {
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
                                                                                            res.json({ success: false, message: eval(language + '.deleteCategory.saveError'), err }); // Return general error message
                                                                                        }
                                                                                    } else {
                                                                                        deleteCategory();
                                                                                    }
                                                                                });
                                                                            }
                                                                        }
                                                                    }
                                                                });

                                                            }
                                                        } else {
                                                            res.json({ success: false, message: eval(language + '.deleteCategory.deleteError') }); // Return error
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
            }
        }
    });
    return router;
};