const User = require('../models/user'); // Import User Model Schema
const Event = require('../models/event'); // Import Event Model Schema
const Category = require('../models/category'); // Import Category Model Schema
const Place = require('../models/place'); // Import Place Model Schema
const Application = require('../models/application'); // Import Application Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.const Place = require('../models/place'); // Import Place Model Schema
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
       CREATE NEW event
    =============================================================== */
    router.post('/newEvent', (req, res) => {
        var language = req.body.event.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if event createdBy was provided
            if (!req.body.event.createdBy) {
                res.json({ success: false, message: eval(language + '.newEvent.createdByProvidedError') }); // Return error
            } else {
                // Check if event category was provided
                if (!req.body.event.categoryId) {
                    res.json({ success: false, message: eval(language + '.newEvent.categoryIdProvidedError') }); // Return error
                } else {
                    // Check if event title was provided
                    if (!req.body.event.title) {
                        res.json({ success: false, message: eval(language + '.newEvent.titleProvidedError') }); // Return error message
                    } else {
                        // Check if event start was provided
                        if (!req.body.event.start) {
                            res.json({ success: false, message: eval(language + '.newEvent.startProvidedError') }); // Return error message
                        } else {
                            // Check if event end was provided
                            if (!req.body.event.end) {
                                res.json({ success: false, message: eval(language + '.newEvent.endProvidedError') }); // Return error message
                            } else {
                                // Check if event description was provided
                                if (!req.body.event.description) {
                                    res.json({ success: false, message: eval(language + '.newEvent.descriptionProvidedError') }); // Return error message
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
                                                                function eventSave(place) {
                                                                    const event = new Event({
                                                                        createdBy: req.body.event.createdBy,
                                                                        categoryId: req.body.event.categoryId,
                                                                        placeId: place._id,
                                                                        language: language,
                                                                        title: req.body.event.title,
                                                                        participants: req.body.event.participants,
                                                                        start: req.body.event.start,
                                                                        end: req.body.event.end,
                                                                        price: req.body.event.price,
                                                                        description: req.body.event.description,
                                                                        observations: req.body.event.observations,
                                                                        images: {
                                                                            poster: req.body.event.imagesPoster,
                                                                            description: req.body.event.imagesDescription
                                                                        },

                                                                        createdAt: Date.now(),
                                                                        updatedAt: Date.now()
                                                                    });
                                                                    // Save event into database
                                                                    event.save((err, event) => {
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
                                                                                        if (err.errors['observations']) {
                                                                                            res.json({ success: false, message: eval(language + err.errors['observations'].message) }); // Return error message
                                                                                        } else {
                                                                                            res.json({ success: false, message: err }); // Return general error message
                                                                                        }
                                                                                    }

                                                                                }
                                                                            } else {
                                                                                res.json({ success: false, message: eval(language + '.newEvent.saveError'), err }); // Return general error message
                                                                            }
                                                                        } else {
                                                                            res.json({ success: true, message: eval(language + '.newEvent.success') }); // Return success message
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
                                                                            subject: ' Find 1 newEvent error ',
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
                                                                                    eventSave(place);
                                                                                }
                                                                            });
                                                                        } else {
                                                                            eventSave(findPlace);
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
            }
        }
    });

    /* ===============================================================
       GET ALL user events
    =============================================================== */
    router.get('/userEvents/:username/:language', (req, res) => {
        var language = req.params.language;
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            if (!req.params.username) {
                res.json({ success: false, message: eval(language + '.userEvents.usernameProvidedError') }); // Return error
            } else {

                Event.aggregate([
                    // Join with Place table
                    {
                        $match: {
                            $or: [{ language: language }, { translation: { $elemMatch: { language: language } } }],
                            $or: [{ createdBy: req.params.username }, { translation: { $elemMatch: { createdBy: req.params.username } } }]
                        }
                    },
                    {
                        $lookup: {
                            from: "places", // other table name
                            localField: "placeId", // placeId of Event table field
                            foreignField: "_id", // _id of Place table field
                            as: "place" // alias for userinfo table
                        }
                    }, {
                        $sort: {
                            start: -1
                        }
                    }, { $unwind: "$place" },
                    // Join with Category table
                    {
                        $lookup: {
                            from: "categories",
                            localField: "categoryId",
                            foreignField: "_id",
                            as: "category"
                        }
                    }, { $unwind: "$category" },
                ]).exec(function(err, events) {
                    // Check if places were found in database
                    if (!events) {
                        res.json({ success: false, message: eval(language + '.userEvents.eventsError') }); // Return error of no places found
                    } else {
                        Category.find({
                            $or: [{ language: language }, { translation: { $elemMatch: { language: language } } }]
                        }, (err, categories) => {
                            // Check if error was found or not
                            if (err) {
                                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                var mailOptions = {
                                    from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                    to: [emailConfig.email], // list of receivers
                                    subject: ' Find 3 getEvent error ',
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
                                // Check if categoryChild were found in database
                                if (!categories) {
                                    res.json({ success: false, message: eval(language + '.getEvent.categoryError') }); // Return error of no event found
                                } else {

                                    function findCategory(childId) {
                                        for (var i in categories) {
                                            if (categories[i]._id.toString() === eval(childId).toString()) {
                                                return categories[i];
                                            }
                                        }
                                    }
                                    for (var i = 0; i < events.length; i++) {
                                        var categoryArray = [];
                                        var child = findCategory('events[' + i + '].categoryId');
                                        categoryArray.unshift(child);
                                        while (child.parentId !== null) {
                                            child = findCategory('child.parentId');
                                            categoryArray.unshift(child);

                                        }
                                        events[i].categories = categoryArray;
                                    }
                                    res.json({ success: true, events: events }); // Return success and place 
                                }
                            }
                        });
                    }
                });
            }
        }
    });
    /* ===============================================================
       GET Events
    =============================================================== */
    router.get('/getEvents/:language', (req, res) => {
        var language = req.params.language;
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            Event.aggregate([ // Join with Place table
                {
                    $match: {
                        "end": { $gte: new Date() }
                    }
                }, {
                    // Join with Place table
                    $lookup: {
                        from: "places", // other table name
                        localField: "placeId", // placeId of Event table field
                        foreignField: "_id", // _id of Place table field
                        as: "place" // alias for userinfo table
                    }
                }, {
                    $sort: {
                        start: 1
                    }
                }, { $unwind: "$place" },
                // Join with Category table
                {
                    $lookup: {
                        from: "comments",
                        localField: "_id",
                        foreignField: "eventId",
                        as: "comments"
                    }
                }
            ]).exec(function(err, events) {
                // Check if places were found in database
                if (!events) {
                    res.json({ success: false, message: eval(language + '.eventsSearch.eventsError') }); // Return error of no places found
                } else {
                    Category.find({
                        $or: [{ language: language }, { translation: { $elemMatch: { language: language } } }]
                    }, (err, categories) => {
                        // Check if error was found or not
                        if (err) {
                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                            var mailOptions = {
                                from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                to: [emailConfig.email], // list of receivers
                                subject: ' Find 3 getEvent error ',
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
                            // Check if categoryChild were found in database
                            if (!categories) {
                                res.json({ success: false, message: eval(language + '.getEvent.categoryError') }); // Return error of no event found
                            } else {

                                function findCategory(childId) {
                                    for (var i in categories) {
                                        if (categories[i]._id.toString() === eval(childId).toString()) {
                                            return categories[i];
                                        }
                                    }
                                }
                                for (var i = 0; i < events.length; i++) {
                                    var categoryArray = [];
                                    var child = findCategory('events[' + i + '].categoryId');
                                    categoryArray.unshift(child);
                                    while (child.parentId !== null) {
                                        child = findCategory('child.parentId');
                                        categoryArray.unshift(child);

                                    }
                                    events[i].categories = categoryArray;
                                }
                                res.json({ success: true, events: events }); // Return success and place 
                            }
                        }
                    });
                }
            });
        }
    });
    /* ===============================================================
       GET Event
    =============================================================== */
    router.get('/getEvent/:id/:language', (req, res) => {
        var language = req.params.language;
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            if (!req.params.id) {
                res.json({ success: false, message: eval(language + '.getEvent.idProvidedError') }); // Return error
            } else {
                Event.aggregate([{
                        $match: {
                            $or: [{ language: language }, { translation: { $elemMatch: { language: language } } }],
                            _id: ObjectId(req.params.id)
                        }
                    },
                    {
                        // Join with Place table
                        $lookup: {
                            from: "places", // other table name
                            localField: "placeId", // placeId of Event table field
                            foreignField: "_id", // _id of Place table field
                            as: "place" // alias for userinfo table
                        }
                    },
                    { $unwind: "$place" }

                ]).exec(function(err, event) {
                    // Check if places were found in database
                    if (!event) {
                        res.json({ success: false, message: eval(language + '.getEvent.eventError') }); // Return error of no event found
                    } else {
                        Category.find({
                            $or: [{ language: language }, { translation: { $elemMatch: { language: language } } }]
                        }, (err, categories) => {
                            // Check if error was found or not
                            if (err) {
                                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                var mailOptions = {
                                    from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                    to: [emailConfig.email], // list of receivers
                                    subject: ' Find 3 getEvent error ',
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
                                // Check if categoryChild were found in database
                                if (!categories) {
                                    res.json({ success: false, message: eval(language + '.getEvent.categoryError') }); // Return error of no event found
                                } else {
                                    var categoryArray = [];

                                    function findCategory(childId) {
                                        for (var i in categories) {
                                            if (categories[i]._id.toString() === eval(childId).toString()) {
                                                return categories[i];
                                            }
                                        }
                                    }
                                    var child = findCategory('event[0].categoryId');
                                    categoryArray.unshift(child);
                                    while (child.parentId !== null) {
                                        child = findCategory('child.parentId');
                                        categoryArray.unshift(child);
                                    }
                                    res.json({ success: true, event: event[0], categories: categoryArray }); // Return success and place 
                                }
                            }
                        });
                    }
                });

            }
        }
    });

    /* ===============================================================
        Route to update/edit a event
    =============================================================== */
    router.put('/editEvent', function(req, res) {
        var language = req.body.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if id was provided
            if (!req.body._id) {
                res.json({ success: false, message: eval(language + '.editEvent.idProvidedError') }); // Return error
            } else {
                // Check if createdBy was provided
                if (!req.body.createdBy) {
                    res.json({ success: false, message: eval(language + '.editEvent.createdByProvidedError') }); // Return error
                } else {
                    var editUser = req.body.createdBy; // Assign _id from event to be editted to a variable
                    if (req.body.createdBy) var newEventCreatedBy = req.body.createdBy; // Check if a change to createdBy was requested
                    if (req.body.categoryId) var newEventCategoryId = req.body.categoryId; // Check if a change to categoryId was requested
                    if (req.body.language) var newEventLanguage = req.body.language; // Check if a change to language was requested
                    if (req.body.title) var newEventTitle = req.body.title; // Check if a change to title was requested
                    if (req.body.participants) var newEventParticipants = req.body.participants; // Check if a change to participants was requested
                    if (req.body.start) var newEventStart = req.body.start; // Check if a change to start was requested
                    if (req.body.end) var newEventEnd = req.body.end; // Check if a change to end was requested
                    if (req.body.price) var newEventPrice = req.body.price; // Check if a change to price was requested
                    if (req.body.description) var newEventDescription = req.body.description; // Check if a change to description was requested
                    if (req.body.observations) var newEventObservations = req.body.observations; // Check if a change to observations was requested
                    if (req.body.images.poster) var newEventImagesPoster = req.body.images.poster; // Check if a change to imagesPoster was requested
                    if (req.body.images.description) var newEventImagesDescription = req.body.images.description; // Check if a change to imagesDescription was requeste
                    if (req.body.translation) var newEventTranslation = req.body.translation; //Check if a change to translation was requested
                    // Look for logged in user in database to check if have appropriate access
                    User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
                        if (err) {
                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                            var mailOptions = {
                                from: "Fred Foo 👻 <" + emailConfig.email + ">", // sender address
                                to: [emailConfig.email],
                                subject: ' Find one 1 edit event error ',
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
                                            subject: ' Find one 1 edit event error ',
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
                                                            subject: ' Find one 2 edit event error ',
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
                                                        function eventSave(place) {
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
                                                                    // Look for event in database
                                                                    Event.findOne({ _id: req.body._id }, function(err, event) {
                                                                        if (err) {
                                                                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                                                            var mailOptions = {
                                                                                from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                                                                to: [emailConfig.email],
                                                                                subject: ' Find one 3 edit event error ',
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
                                                                            // Check if event is in database
                                                                            if (!event) {
                                                                                res.json({ success: false, message: eval(language + '.editUser.userError') }); // Return error
                                                                            } else {
                                                                                if (newEventCreatedBy)
                                                                                    event.createdBy = newEventCreatedBy; // Assign new createdBy to event in database
                                                                                if (newEventCategoryId)
                                                                                    event.categoryId = newEventCategoryId; // Assign new categoryId to event in database
                                                                                if (place._id)
                                                                                    event.placeId = place._id; // Assign new placeId to event in database
                                                                                if (newEventLanguage)
                                                                                    event.language = newEventLanguage; // Assign new language to event in database
                                                                                if (newEventTitle)
                                                                                    event.title = newEventTitle; // Assign new title to event in database
                                                                                if (newEventParticipants)
                                                                                    event.participants = newEventParticipants; // Assign new participants to event in database
                                                                                if (newEventStart)
                                                                                    event.start = newEventStart; // Assign new start to event in database
                                                                                if (newEventEnd)
                                                                                    event.end = newEventEnd; // Assign new end to event in database
                                                                                if (newEventPrice)
                                                                                    event.price = newEventPrice; // Assign new price to event in database
                                                                                if (newEventDescription)
                                                                                    event.description = newEventDescription; // Assign new description to event in database
                                                                                if (newEventObservations)
                                                                                    event.observations = newEventObservations; // Assign new observations to event in database
                                                                                if (newEventImagesPoster)
                                                                                    event.images.poster = newEventImagesPoster; // Assign new imagesPoster to event in database
                                                                                if (newEventImagesDescription)
                                                                                    event.images.description = newEventImagesDescription; // Assign new imagesDescription to event in database
                                                                                if (newEventTranslation)
                                                                                    event.translation = newEventTranslation; // Assign newTranslation to event in database
                                                                                event.updatedAt = Date.now();
                                                                                // Save event into database
                                                                                event.save((err, event) => {
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
                                                                                                    if (err.errors['observations']) {
                                                                                                        res.json({ success: false, message: eval(language + err.errors['observations'].message) }); // Return error message
                                                                                                    } else {
                                                                                                        res.json({ success: false, message: err }); // Return general error message
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        } else {
                                                                                            res.json({ success: false, message: eval(language + '.editEvent.saveError'), err }); // Return general error message
                                                                                        }
                                                                                    } else {
                                                                                        res.json({ success: true, event: event, message: eval(language + '.editEvent.success') }); // Return success message
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
                                                                    eventSave(place);
                                                                }
                                                            });
                                                        } else {
                                                            eventSave(findPlace);
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
           GET ALL events search
        =============================================================== */
    router.get('/eventsSearch/:search?/:language', (req, res) => {
        var language = req.params.language;
        var search = req.params.search;
        if (!language) {
            res.json({ success: false, message: "No se encontro el lenguaje" }); // Return error
        } else {
            if (!search) {
                res.json({ success: false, message: eval(language + '.eventsSearch.searchTermProvidedError') }); // Return error
            } else {
                // Search database for all events posts
                Event.find({
                    title: {
                        $regex: new RegExp(".*" + search + ".*", "i")
                    },
                    language: language
                }, (err, events) => {
                    // Check if error was found or not
                    if (err) {
                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                        var mailOptions = {
                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                            to: [emailConfig.email], // list of receivers
                            subject: ' Find 1 allThemes error ',
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
                        // Check if events were found in database
                        if (!events) {
                            res.json({ success: false, message: eval(language + '.eventsSearch.eventsError') }); // Return error of no events found
                        } else {
                            res.json({ success: true, events: events }); // Return success and events array
                        }
                    }
                }).sort({ '_id': -1 }); // Sort events from newest to oldest

            }
        }

    });
    /* ===============================================================
        Route to delete a event
    =============================================================== */
    router.delete('/deleteEvent/:username/:id/:language', function(req, res) {
        var language = req.params.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if username was provided
            if (!req.params.username) {
                res.json({ success: false, message: eval(language + '.deleteEvent.usernameProvidedError') }); // Return error
            } else {
                // Check if event id was provided
                if (!req.params.id) {
                    res.json({ success: false, message: eval(language + '.deleteEvent.idProvidedError') }); // Return error
                } else {
                    var deleteUser = req.params.username; // Assign the username from request parameters to a variable
                    // Look for logged in user in database to check if have appropriate access
                    User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
                        if (err) {
                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                            var mailOptions = {
                                from: "Fred Foo 👻 <" + emailConfig.email + ">", // sender address
                                to: [emailConfig.email],
                                subject: ' Find one 1 delete event error ',
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
                                                // Fine the user that needs to be deleted
                                                Event.findOneAndRemove({ _id: req.params.id }, function(err, event) {
                                                    if (err) {
                                                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                                        var mailOptions = {
                                                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                                            to: [emailConfig.email],
                                                            subject: ' Find one and remove for delete event ',
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
                                                        Application.update({
                                                            events: ObjectId(req.params.id)
                                                        }, { $pull: { events: ObjectId(req.params.id) } }, { multi: true }, function(err, application) {
                                                            // Check if error
                                                            if (err) {
                                                                console.log(err);
                                                                // Check if error is a validation error
                                                                if (err.errors) {
                                                                    // Check if validation error is in the category field
                                                                    if (err.errors['title']) {
                                                                        res.json({ success: false, message: eval(language + err.errors['title'].message) }); // Return error message
                                                                    } else {
                                                                        if (err.errors['name']) {
                                                                            res.json({ success: false, message: eval(language + err.errors['name'].message) }); // Return error message
                                                                        } else {
                                                                            res.json({ success: false, message: err }); // Return general error message
                                                                        }
                                                                    }
                                                                } else {
                                                                    res.json({ success: false, message: eval(language + '.deleteEvent.saveError'), err }); // Return general error message
                                                                }
                                                            } else {
                                                                res.json({ success: true, message: eval(language + '.deleteEvent.success') }); // Return success message
                                                            }
                                                        });

                                                        function deleteImages(images, bucket) {
                                                            var imagesKey = [];
                                                            for (var i = 0; i < images.length; i++) {
                                                                if (bucket === "event-poster") {
                                                                    var currentUrlSplit = images[i].url.split("/");
                                                                    let imageName = currentUrlSplit[currentUrlSplit.length - 1];
                                                                    var urlSplit = imageName.split("%2F");
                                                                    imagesKey.push({
                                                                        Key: bucket + "/" + urlSplit[0]
                                                                    });
                                                                } else if (bucket === "event-description") {
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
                                                                        subject: 'Error delete images event',
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
                                                        if (event.images.poster.length > 0) {
                                                            deleteImages(event.images.poster, "event-poster");
                                                        }
                                                        if (event.images.description.length > 0) {
                                                            deleteImages(event.images.description, "event-description");
                                                        }
                                                        for (var i = 0; i < event.translation.length; i++) {
                                                            if (event.translation[i].images.poster.length > 0) {
                                                                deleteImages(event.translation[i].images.poster, "event-poster");
                                                            }
                                                            if (event.translation[i].images.description.length > 0) {
                                                                deleteImages(event.translation[i].images.description, "event-description");
                                                            }
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
        Route to add reaction
    =============================================================== */
    router.put('/newReactionEvent', (req, res) => {
        var language = req.body.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if id was passed provided in request body
            if (!req.body.id) {

                res.json({ success: false, message: eval(language + '.newEventReaction.idProvidedError') }); // Return error message
            } else {
                if (!req.body.reaction) {
                    res.json({ success: false, message: eval(language + '.newEventReaction.reactionProvidedError') }); // Return error message
                } else {
                    // Search the database with id
                    Event.findOne({
                        _id: req.body.id
                    }, (err, event) => {
                        // Check if error was encountered
                        if (err) {
                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                            var mailOptions = {
                                from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                to: [emailConfig.email], // list of receivers
                                subject: ' Find 1 addReactionEvent error ',
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
                            // Check if id matched the id of a event post in the database
                            if (!event) {
                                res.json({ success: false, message: eval(language + '.newEventReaction.eventError') }); // Return error message
                            } else {
                                // Get data from user that is signed in
                                User.findOne({ _id: req.decoded.userId }, (err, user) => {
                                    // Check if error was found
                                    if (err) {
                                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                        var mailOptions = {
                                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                            to: [emailConfig.email], // list of receivers
                                            subject: ' Find one 2 addReactionEvent event error ',
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
                                        // Check if id of user in session was found in the database
                                        if (!user) {
                                            res.json({ success: false, message: eval(language + '.newEventReaction.userError') }); // Return error message
                                        } else {
                                            var reactions = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];
                                            var insert = false;
                                            var limit = false;
                                            // Check if the user who liked the post has already liked the event post before
                                            for (var i = 0; i < reactions.length && !limit; i++) {
                                                if (eval('event.reactions.' + reactions[i] + 'By').includes(user.username)) {
                                                    limit = true;
                                                    if (req.body.reaction === reactions[i]) {
                                                        res.json({ success: false, message: eval(language + '.newEventReaction.likedBeforeError') }); // Return error message
                                                    } else {
                                                        //Delete reaction
                                                        insert = true;
                                                        eval('event.reactions.' + reactions[i] + 'By').splice(eval('event.reactions.' + reactions[i] + 'By').indexOf(user.username), 1);
                                                    }
                                                }
                                            }
                                            if (insert || !limit) {
                                                // Save event post data
                                                eval('event.reactions.' + req.body.reaction + 'By').push(user.username);
                                                event.save((err) => {
                                                    // Check if error was found
                                                    if (err) {
                                                        res.json({ success: false, message: eval(language + '.newEventReaction.saveError'), err }); // Return general error message
                                                    } else {
                                                        res.json({ success: true, message: eval(language + '.newEventReaction.success') }); // Return error message
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
            } // Check if id was passed provided in request body
        }
    });
    /* ===============================================================
       DISLIKE event POST
    =============================================================== */
    router.put('/deleteReactionEvent', (req, res) => {
        var language = req.body.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "No se encontro el lenguaje" }); // Return error
        } else {
            // Check if id was provided inside the request body
            if (!req.body.id) {
                res.json({ success: false, message: eval(language + '.deleteEventReaction.idProvidedError') }); // Return error message
            } else {
                // Search database for event post using the id
                Event.findOne({
                    _id: req.body.id
                }, (err, event) => {
                    // Check if error was found
                    if (err) {
                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                        var mailOptions = {
                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                            to: [emailConfig.email], // list of receivers
                            subject: ' Find one 1 deleteReactionEvent error ',
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
                        // Check if event post with the id was found in the database
                        if (!event) {
                            res.json({ success: false, message: eval(language + '.deleteEventReaction.eventError') }); // Return error message
                        } else {
                            // Get data of user who is logged in
                            User.findOne({ _id: req.decoded.userId }, (err, user) => {
                                // Check if error was found
                                if (err) {
                                    // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.

                                    var mailOptions = {
                                        from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                        to: [emailConfig.email], // list of receivers
                                        subject: ' Find one 2 deleteReactionEvent error ',
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
                                    // Check if user was found in the database
                                    if (!user) {
                                        res.json({ success: false, message: eval(language + '.deleteEventReaction.userError') }); // Return error message
                                    } else {
                                        // Check if the user who disliked the post has already liked the event post before
                                        var reactions = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];
                                        for (var i = 0; i < reactions.length; i++) {
                                            if (eval('event.reactions.' + reactions[i] + 'By').includes(user.username)) {
                                                //delete reactions
                                                eval('event.reactions.' + reactions[i] + 'By').splice(eval('event.reactions.' + reactions[i] + 'By').indexOf(user.username), 1);
                                                // Save event post data
                                                event.save((err) => {
                                                    // Check if error was found
                                                    if (err) {
                                                        res.json({ success: false, message: eval(language + '.deleteEventReaction.saveError'), err }); // Return general error message
                                                    } else {
                                                        res.json({ success: true, message: eval(language + '.deleteEventReaction.success') }); // Return error message
                                                    }
                                                });
                                            }

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
    return router;
};