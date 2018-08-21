const User = require('../models/user'); // Import User Model Schema
const Service = require('../models/service'); // Import Service Model Schema
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
       CREATE NEW service
    =============================================================== */
    router.post('/newService', (req, res) => {
        var language = req.body.service.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if service createdBy was provided
            if (!req.body.service.createdBy) {
                res.json({ success: false, message: eval(language + '.newService.createdByProvidedError') }); // Return error
            } else {
                // Check if service serviceTypeId was provided
                if (!req.body.service.serviceTypeId) {
                    res.json({ success: false, message: eval(language + '.newService.serviceTypeIdProvidedError') }); // Return error
                } else {
                    // Check if service title was provided
                    if (!req.body.service.title) {
                        res.json({ success: false, message: eval(language + '.newService.titleProvidedError') }); // Return error
                    } else {
                        // Check if service description was provided
                        if (!req.body.service.description) {
                            res.json({ success: false, message: eval(language + '.newService.descriptionProvidedError') }); // Return error message
                        } else {
                            // Check if place province was provided
                            if (!req.body.place.province) {
                                res.json({ success: false, message: eval(language + '.newPlace.provinceProvidedError') }); // Return error message
                            } else {
                                // Check if place geonameIdProvince was provided
                                if (!req.body.place.geonameIdProvince) {
                                    res.json({ success: false, message: eval(language + '.newPlace.geonameIdProvinceProvidedError') }); // Return error message
                                } else {
                                    // Check if place municipality was provided
                                    if (!req.body.place.municipality) {
                                        res.json({ success: false, message: eval(language + '.newPlace.municipalityProvidedError') }); // Return error message
                                    } else {
                                        // Check if place geonameIdMunicipality was provided
                                        if (!req.body.place.geonameIdMunicipality) {
                                            res.json({ success: false, message: eval(language + '.newPlace.geonameIdMunicipalityProvidedError') }); // Return error message
                                        } else {
                                            // Check if place lat was provided
                                            if (!req.body.place.lat) {
                                                res.json({ success: false, message: eval(language + '.newPlace.latProvidedError') }); // Return error message
                                            } else {
                                                // Check if place lng was provided
                                                if (!req.body.place.lng) {
                                                    res.json({ success: false, message: eval(language + '.newPlace.lngProvidedError') }); // Return error message
                                                } else {
                                                    // Check if location was provided
                                                    if (!req.body.place.location) {
                                                        res.json({ success: false, message: eval(language + '.newPlace.locationProvidedError') }); // Return error message
                                                    } else {
                                                        function serviceSave(place) {
                                                            const service = new Service({
                                                                createdBy: req.body.service.createdBy,
                                                                serviceTypeId: req.body.service.serviceTypeId,
                                                                placeId: place._id,
                                                                language: language,
                                                                title: req.body.service.title,
                                                                description: req.body.service.description,
                                                                createdAt: Date.now(),
                                                                updatedAt: Date.now(),
                                                                expiredAt: req.body.service.expiredAt
                                                            });
                                                            // Save service into database
                                                            service.save((err, service) => {
                                                                // Check if error
                                                                if (err) {
                                                                    // Check if error is a validation error
                                                                    if (err.errors) {
                                                                        // Check if validation error is in the category field
                                                                        place.remove((err) => {
                                                                            if (err) {
                                                                                res.json({ success: false, message: eval(language + '.deletePlace.saveError'), err }); // Return general error message
                                                                            }
                                                                        });
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
                                                                        res.json({ success: false, message: eval(language + '.newService.saveError'), err }); // Return general error message
                                                                    }
                                                                } else {
                                                                    res.json({ success: true, message: eval(language + '.newService.success') }); // Return success message
                                                                }
                                                            });
                                                        }
                                                        const place = new Place({
                                                            language: language,
                                                            province: {
                                                                name: req.body.place.province,
                                                                geonameId: req.body.place.geonameIdProvince
                                                            },
                                                            municipality: {
                                                                name: req.body.place.municipality,
                                                                geonameId: req.body.place.geonameIdMunicipality,
                                                            },
                                                            location: req.body.place.location,
                                                            coordinates: {
                                                                lat: req.body.place.lat,
                                                                lng: req.body.place.lng
                                                            },
                                                            createdAt: Date.now(),
                                                            updatedAt: Date.now()
                                                        });
                                                        Place.findOne({
                                                            $or: [{ language: language }, { translation: { $elemMatch: { language: language } } }],
                                                            province: {
                                                                name: req.body.place.province,
                                                                geonameId: req.body.place.geonameIdProvince
                                                            },
                                                            municipality: {
                                                                name: req.body.place.municipality,
                                                                geonameId: req.body.place.geonameIdMunicipality,
                                                            },
                                                            location: req.body.place.location,
                                                            coordinates: {
                                                                lat: req.body.place.lat,
                                                                lng: req.body.place.lng
                                                            }
                                                        }, (err, findPlace) => {
                                                            // Check if error was found or not
                                                            if (err) {
                                                                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                                                var mailOptions = {
                                                                    from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                                                    to: [emailConfig.email], // list of receivers
                                                                    subject: ' Find 1 newService error ',
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
                                                                // Check if place were found in database
                                                                if (!findPlace) {
                                                                    // Save place into database
                                                                    place.save((err, place) => {
                                                                        // Check if error
                                                                        if (err) {
                                                                            // Check if error is a validation error         
                                                                            if (err.errors) {
                                                                                console.log(err.errors);
                                                                                // Check if validation error is in the category field
                                                                                if (err.errors['location']) {
                                                                                    res.json({ success: false, message: eval(language + err.errors['location'].message) }); // Return error message
                                                                                } else {
                                                                                    if (err.errors['coordinates.lat']) {
                                                                                        res.json({ success: false, message: eval(language + err.errors['coordinates.lat'].message) }); // Return error message
                                                                                    } else {
                                                                                        if (err.errors['coordinates.lng']) {
                                                                                            res.json({ success: false, message: eval(language + err.errors['coordinates.lng'].message) }); // Return error message
                                                                                        } else {
                                                                                            res.json({ success: false, message: err }); // Return general error message
                                                                                        }
                                                                                    }
                                                                                }
                                                                            } else {
                                                                                res.json({ success: false, message: eval(language + '.newPlace.saveError'), err }); // Return general error message
                                                                            }
                                                                        } else {
                                                                            serviceSave(place);
                                                                        }
                                                                    });
                                                                } else {
                                                                    serviceSave(findPlace);
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    /* ===============================================================
       GET Services
    =============================================================== */
    router.get('/getServices/:language', (req, res) => {
        var language = req.params.language;
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            Service.aggregate([{
                    $match: {
                        $or: [{ language: language }, { translation: { $elemMatch: { language: language } } }]
                    }
                }, {
                    // Join with Place table
                    $lookup: {
                        from: "places", // other table name
                        localField: "placeId", // placeId of Event table field
                        foreignField: "_id", // _id of Place table field
                        as: "place" // alias for userinfo table
                    }
                }, { $unwind: "$place" },
                // Join with Service type table
                {
                    $lookup: {
                        from: "servicetypes",
                        localField: "serviceTypeId",
                        foreignField: "_id",
                        as: "serviceType"
                    }
                }, { $unwind: "$serviceType" }
            ]).exec(function(err, services) {
                // Check if places were found in database
                if (!services) {
                    res.json({ success: false, message: eval(language + '.newService.servicesError') }); // Return error of no services found
                } else {
                    res.json({ success: true, services: services }); // Return success and place 
                }
            });
        }
    });
    /* ===============================================================
           GET Service
        =============================================================== */
    router.get('/getService/:id/:username/:language', (req, res) => {
        var language = req.params.language;
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            if (!req.params.id) {
                res.json({ success: false, message: eval(language + '.getService.idProvidedError') }); // Return error
            } else {
                if (!req.params.username) {
                    res.json({ success: false, message: eval(language + '.getService.usernameProvidedError') }); // Return error
                } else {
                    // Look for logged in user in database to check if have appropriate access
                    User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
                        if (err) {
                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                            var mailOptions = {
                                from: "Fred Foo 👻 <" + emailConfig.email + ">", // sender address
                                to: [emailConfig.email],
                                subject: ' Find one 1 get service error ',
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
                                res.json({ success: false, message: eval(language + '.getService.userError') }); // Return error
                            } else {
                                // Look for user in database
                                User.findOne({ username: req.params.username }, function(err, user) {
                                    if (err) {
                                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                        var mailOptions = {
                                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                            to: [emailConfig.email],
                                            subject: ' Find one 2 get service error ',
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
                                            res.json({ success: false, message: eval(language + '.getService.userError') }); // Return error
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
                                                Service.aggregate([{
                                                        $match: {
                                                            $or: [{ language: language }, { translation: { $elemMatch: { language: language } } }],
                                                            _id: ObjectId(req.params.id)
                                                        }
                                                    }, {
                                                        // Join with Place table
                                                        $lookup: {
                                                            from: "places", // other table name
                                                            localField: "placeId", // placeId of Service table field
                                                            foreignField: "_id", // _id of Place table field
                                                            as: "place" // alias for userinfo table
                                                        }
                                                    },
                                                    { $unwind: "$place" },
                                                    // Join with Service type table
                                                    {
                                                        $lookup: {
                                                            from: "servicetypes",
                                                            localField: "serviceTypeId",
                                                            foreignField: "_id",
                                                            as: "serviceType"
                                                        }
                                                    }, { $unwind: "$serviceType" }

                                                ]).exec(function(err, service) {
                                                    // Check if places were found in database
                                                    if (!service) {
                                                        res.json({ success: false, message: eval(language + '.getService.serviceError') }); // Return error of no service found
                                                    } else {
                                                        res.json({ success: true, service: service[0] }); // Return success and place 
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
           GET ALL user services
        =============================================================== */
    router.get('/userServices/:username/:language', (req, res) => {
        var language = req.params.language;
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            if (!req.params.username) {
                res.json({ success: false, message: eval(language + '.userServices.usernameProvidedError') }); // Return error
            } else {
                Service.aggregate([{
                    $match: {
                        $or: [{ language: language }, { translation: { $elemMatch: { language: language } } }],
                        $or: [{ createdBy: req.params.username }, { translation: { $elemMatch: { createdBy: req.params.username } } }]
                    }
                }, {
                    // Join with Place table
                    $lookup: {
                        from: "places", // other table name
                        localField: "placeId", // placeId of Event table field
                        foreignField: "_id", // _id of Place table field
                        as: "place" // alias for userinfo table
                    }
                }, { $unwind: "$place" }, {
                    // Join with service type table
                    $lookup: {
                        from: "servicetypes", // other table name
                        localField: "serviceTypeId", // placeId of Service table field
                        foreignField: "_id", // _id of service type table field
                        as: "serviceType" // alias for userinfo table
                    }
                }, { $unwind: "$serviceType" }]).exec(function(err, services) {
                    // Check if places were found in database
                    if (!services) {
                        res.json({ success: false, message: eval(language + '.newService.servicesError') }); // Return error of no services found
                    } else {
                        res.json({ success: true, services: services }); // Return success and place 
                    }
                });
            }
        }
    });

    /* ===============================================================
        Route to update/edit a service
    =============================================================== */
    router.put('/editService', function(req, res) {
        var language = req.body.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if id was provided
            if (!req.body._id) {
                res.json({ success: false, message: eval(language + '.editService.idProvidedError') }); // Return error
            } else {
                // Check if createdBy was provided
                if (!req.body.createdBy) {
                    res.json({ success: false, message: eval(language + '.editService.createdByProvidedError') }); // Return error
                } else {
                    var editUser = req.body.createdBy; // Assign _id from service to be editted to a variable
                    if (req.body.createdBy) var newServiceCreatedBy = req.body.createdBy; // Check if a change to createdBy was requested
                    if (req.body.serviceTypeId) var newServiceTypeId = req.body.serviceTypeId; // Check if a change to serviceTypeId was requested
                    if (req.body.language) var newServiceLanguage = req.body.language; // Check if a change to language was requested
                    if (req.body.title) var newServiceTitle = req.body.title; // Check if a change to title was requested
                    if (req.body.description) var newServiceDescription = req.body.description; // Check if a change to description was requested
                    if (req.body.images) var newServiceImages = req.body.images; // Check if a change to imagesDescription was requeste
                    if (req.body.expiredAt) var newServiceExpiredAt = req.body.expiredAt; // Check if a change to expiredAt was requested
                    if (req.body.translation) var newServiceTranslation = req.body.translation; //Check if a change to translation was requested
                    // Look for logged in user in database to check if have appropriate access
                    User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
                        if (err) {
                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                            var mailOptions = {
                                from: "Fred Foo 👻 <" + emailConfig.email + ">", // sender address
                                to: [emailConfig.email],
                                subject: ' Find one 1 edit service error ',
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
                                            subject: ' Find one 1 edit service error ',
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
                                                Place.findOne({
                                                    $or: [{ language: language }, { translation: { $elemMatch: { language: language } } }],
                                                    province: {
                                                        name: req.body.place.province.name,
                                                        geonameId: req.body.place.province.geonameId
                                                    },
                                                    municipality: {
                                                        name: req.body.place.municipality.name,
                                                        geonameId: req.body.place.municipality.geonameId,
                                                    },
                                                    location: req.body.place.location,
                                                    coordinates: {
                                                        lat: req.body.place.coordinates.lat,
                                                        lng: req.body.place.coordinates.lng
                                                    }
                                                }, (err, findPlace) => {
                                                    // Check if error was found or not
                                                    if (err) {
                                                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                                        var mailOptions = {
                                                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                                            to: [emailConfig.email], // list of receivers
                                                            subject: ' Find one 2 edit service error ',
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
                                                        //save traduction
                                                        function serviceSave(place) {
                                                            place.translation = req.body.place.translation;
                                                            place.save((err, place) => {
                                                                // Check if error
                                                                if (err) {
                                                                    console.log(err);
                                                                    // Check if error is a validation error         
                                                                    if (err.errors) {
                                                                        console.log(err.errors);
                                                                        // Check if validation error is in the category field
                                                                        if (err.errors['location']) {
                                                                            res.json({ success: false, message: eval(language + err.errors['location'].message) }); // Return error message
                                                                        } else {
                                                                            if (err.errors['coordinates.lat']) {
                                                                                res.json({ success: false, message: eval(language + err.errors['coordinates.lat'].message) }); // Return error message
                                                                            } else {
                                                                                if (err.errors['coordinates.lng']) {
                                                                                    res.json({ success: false, message: eval(language + err.errors['coordinates.lng'].message) }); // Return error message
                                                                                } else {
                                                                                    res.json({ success: false, message: err }); // Return general error message
                                                                                }
                                                                            }
                                                                        }
                                                                    } else {
                                                                        res.json({ success: false, message: eval(language + '.newPlace.saveError'), err }); // Return general error message
                                                                    }
                                                                } else {
                                                                    // Look for service in database
                                                                    Service.findOne({ _id: req.body._id }, function(err, service) {
                                                                        if (err) {
                                                                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                                                            var mailOptions = {
                                                                                from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                                                                to: [emailConfig.email],
                                                                                subject: ' Find one 3 edit service error ',
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
                                                                            // Check if service is in database
                                                                            if (!service) {
                                                                                res.json({ success: false, message: eval(language + '.editUser.userError') }); // Return error
                                                                            } else {
                                                                                if (newServiceCreatedBy)
                                                                                    service.createdBy = newServiceCreatedBy; // Assign new createdBy to service in database
                                                                                if (newServiceTypeId)
                                                                                    service.serviceTypeId = newServiceTypeId; // Assign new serviceTypeId to service in database
                                                                                if (place._id)
                                                                                    service.placeId = place._id; // Assign new placeId to service in database
                                                                                if (newServiceLanguage)
                                                                                    service.language = newServiceLanguage; // Assign new language to service in database
                                                                                if (newServiceTitle)
                                                                                    service.title = newServiceTitle; // Assign new title to service in database
                                                                                if (newServiceDescription)
                                                                                    service.description = newServiceDescription; // Assign new description to service in database
                                                                                if (newServiceImages)
                                                                                    service.images = newServiceImages; // Assign new imagesDescription to service in database
                                                                                if (newServiceExpiredAt)
                                                                                    service.expiredAt = newServiceExpiredAt; // Assign new expiredAt to service in database
                                                                                if (newServiceTranslation)
                                                                                    service.translation = newServiceTranslation; // Assign newTranslation to service in database
                                                                                service.updatedAt = Date.now();
                                                                                // Save service into database
                                                                                service.save((err, service) => {
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
                                                                                            res.json({ success: false, message: eval(language + '.editService.saveError'), err }); // Return general error message
                                                                                        }
                                                                                    } else {
                                                                                        res.json({ success: true, message: eval(language + '.editService.success') }); // Return success message
                                                                                    }
                                                                                });
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                        // Check if place were found in database
                                                        if (!findPlace) {
                                                            const place = new Place({
                                                                language: language,
                                                                province: {
                                                                    name: req.body.place.province.name,
                                                                    geonameId: req.body.place.province.geonameId
                                                                },
                                                                municipality: {
                                                                    name: req.body.place.municipality.name,
                                                                    geonameId: req.body.place.municipality.geonameId,
                                                                },
                                                                location: req.body.place.location,
                                                                translation: req.body.place.translation,
                                                                coordinates: {
                                                                    lat: req.body.place.coordinates.lat,
                                                                    lng: req.body.place.coordinates.lng
                                                                },
                                                                createdAt: Date.now(),
                                                                updatedAt: Date.now()
                                                            });
                                                            // Save place into database
                                                            place.save((err, place) => {
                                                                // Check if error
                                                                if (err) {
                                                                    // Check if error is a validation error         
                                                                    if (err.errors) {
                                                                        console.log(err.errors);
                                                                        // Check if validation error is in the category field
                                                                        if (err.errors['location']) {
                                                                            res.json({ success: false, message: eval(language + err.errors['location'].message) }); // Return error message
                                                                        } else {
                                                                            if (err.errors['coordinates.lat']) {
                                                                                res.json({ success: false, message: eval(language + err.errors['coordinates.lat'].message) }); // Return error message
                                                                            } else {
                                                                                if (err.errors['coordinates.lng']) {
                                                                                    res.json({ success: false, message: eval(language + err.errors['coordinates.lng'].message) }); // Return error message
                                                                                } else {
                                                                                    res.json({ success: false, message: err }); // Return general error message
                                                                                }
                                                                            }
                                                                        }
                                                                    } else {
                                                                        res.json({ success: false, message: eval(language + '.newPlace.saveError'), err }); // Return general error message
                                                                    }
                                                                } else {
                                                                    serviceSave(place);
                                                                }
                                                            });
                                                        } else {
                                                            serviceSave(findPlace);
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
            Route to delete a service
        =============================================================== */
    router.delete('/deleteService/:username/:id/:language', function(req, res) {
        var language = req.params.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if username was provided
            if (!req.params.username) {
                res.json({ success: false, message: eval(language + '.deleteService.usernameProvidedError') }); // Return error
            } else {
                // Check if service id was provided
                if (!req.params.id) {
                    res.json({ success: false, message: eval(language + '.deleteService.idProvidedError') }); // Return error
                } else {
                    var deleteUser = req.params.username; // Assign the username from request parameters to a variable
                    // Look for logged in user in database to check if have appropriate access
                    User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
                        if (err) {
                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                            var mailOptions = {
                                from: "Fred Foo 👻 <" + emailConfig.email + ">", // sender address
                                to: [emailConfig.email],
                                subject: ' Find one 1 delete service error ',
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
                                            subject: ' Find one 2 delete service error ',
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
                                                    services: ObjectId(req.params.id)
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
                                                                // Fine the service that needs to be deleted
                                                                Service.findOneAndRemove({ _id: req.params.id }, function(err, service) {
                                                                    if (err) {
                                                                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                                                        var mailOptions = {
                                                                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                                                            to: [emailConfig.email],
                                                                            subject: ' Find one and remove for delete service ',
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
                                                                                if (bucket === "service-description") {
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
                                                                                        subject: 'Error delete images service',
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
                                                                        if (service.images.length > 0) {
                                                                            deleteImages(service.images, "service-description");
                                                                        }
                                                                        for (var i = 0; i < service.translation.length; i++) {
                                                                            if (service.translation[i].images.description.length > 0) {
                                                                                deleteImages(service.translation[i].images, "service-description");
                                                                            }
                                                                        }
                                                                    }
                                                                });
                                                            } else {
                                                                res.json({ success: false, message: eval(language + '.deleteService.deleteError') }); // Return error
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