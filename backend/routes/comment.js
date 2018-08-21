const User = require('../models/user'); // Import User Model Schema
const Event = require('../models/event'); // Import Event Model Schema
const Comment = require('../models/comment'); // Import Event Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const configAws = require('../config/aws'); // Import database configuration
const es = require('../translate/es'); // Import translate es
const eu = require('../translate/eu'); // Import translate eu
const en = require('../translate/en'); // Import translate en
const nodemailer = require('nodemailer');
const emailConfig = require('../config/email'); // Mongoose Email
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
    /* ===============================================================
       CREATE NEW comment
    =============================================================== */
    router.post('/newComment', (req, res) => {
        var language = req.body.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if comment eventId was provided
            if (!req.body.eventId) {
                res.json({ success: false, message: eval(language + '.newComment.eventIdProvidedError') }); // Return error
            } else {
                // Check if comment was provided
                if (!req.body.comment) {
                    res.json({ success: false, message: eval(language + '.newComment.commentProvidedError') }); // Return error message
                } else {
                    // Check if comment createdBy was provided
                    if (!req.body.createdBy) {
                        res.json({ success: false, message: eval(language + '.newComment.createdByProvidedError') }); // Return error
                    } else {
                        if (!req.body.parentId) {
                            req.body.parentId = null;
                        }
                        var mentionedArray = [];
                        if (req.body.mentionedUsers) {
                            for (var i = 0; i < req.body.mentionedUsers.length; i++) {
                                mentionedArray.push({ username: req.body.mentionedUsers[i], readed: false });
                            }
                        }
                        // Create the event object for insertion into database
                        const comment = new Comment({
                            firstParentId: req.body.firstParentId,
                            parentId: req.body.parentId,
                            level: req.body.level,
                            eventId: req.body.eventId,
                            mentionedUsers: mentionedArray,
                            comment: req.body.comment,
                            createdBy: req.body.createdBy,
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                            reactions: {
                                likeBy: req.body.likeBy,
                                loveBy: req.body.loveBy,
                                hahaBy: req.body.hahaBy,
                                wowBy: req.body.wowBy,
                                sadBy: req.body.sadBy,
                                angryBy: req.body.angryBy
                            }
                        });
                        // Save event into database
                        comment.save((err) => {
                            // Check if error
                            if (err) {
                                // Check if error is a validation error
                                if (err.errors) {
                                    // Check if validation error is in the comment field
                                    if (err.errors['comment']) {
                                        res.json({ success: false, message: eval(language + err.errors['comment'].message) }); // Return error message
                                    } else {
                                        res.json({ success: false, message: err }); // Return general error message
                                    }
                                } else {
                                    res.json({ success: false, message: eval(language + '.newComment.saveError'), err }); // Return general error message
                                }
                            } else {
                                res.json({ success: true, message: eval(language + '.newComment.success') }); // Return success message
                            }
                        });
                    }
                }
            }
        }
    });
    /* ===============================================================
       GET Comments
    =============================================================== */
    router.get('/getComments/:id/:language', (req, res) => {
        var language = req.params.language;
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            if (!req.params.id) {
                res.json({ success: false, message: eval(language + '.getComment.idProvidedError') }); // Return error
            } else {
                Comment.aggregate([{
                        $match: {
                            eventId: ObjectId(req.params.id)
                        },
                    }, {
                        $sort: {
                            createdAt: 1
                        }
                    }, {
                        // Join with Place table
                        $lookup: {
                            from: "users", // other table name
                            localField: "createdBy", // placeId of Comment table field
                            foreignField: "username", // _id of Place table field
                            as: "user" // alias for userinfo table
                        }
                    }, { $unwind: "$user" },
                    {
                        $group: {
                            _id: { $ifNull: ["$firstParentId", "$_id"] },
                            groupComments: { $push: "$$ROOT" }
                        },
                    },
                    {
                        $sort: {
                            _id: -1,
                        }
                    }
                ]).exec(function(err, comments) {
                    // Check if places were found in database
                    if (!comments) {
                        res.json({ success: false, message: err }); // Return error of no places found
                    } else {
                        res.json({ success: true, comments: comments }); // Return success and place 
                    }
                });
            }
        }
    });
    /* ===============================================================
       GET Comments
    =============================================================== */
    router.get('/getCommentsNotification/:username/:language', (req, res) => {
        var language = req.params.language;
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            if (!req.params.username) {
                res.json({ success: false, message: eval(language + '.getComment.usernameProvidedError') }); // Return error
            } else {
                Comment.aggregate([{
                        $match: {
                            "mentionedUsers.username": req.params.username
                        },
                    }, {
                        $sort: {
                            createdAt: -1
                        }
                    }, {
                        // Join with Place table
                        $lookup: {
                            from: "users", // other table name
                            localField: "createdBy", // placeId of Comment table field
                            foreignField: "username", // _id of Place table field
                            as: "user" // alias for userinfo table
                        }
                    }, { $unwind: "$user" },
                    {
                        $project: {
                            title: 1,
                            comment: 1,
                            "user.currentAvatar": 1,
                            createdAt: 1,
                            eventId:1,
                            mentionedUsers: {
                                $filter: {
                                    input: "$mentionedUsers",
                                    as: "mentionedUser",
                                    cond: {
                                        $eq: ["$$mentionedUser.username", req.params.username]
                                    }
                                }
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$mentionedUsers.readed",
                            groupComments: { $push: "$$ROOT" }
                        }
                    },
                    {
                        $sort: {
                            _id: 1,
                        }
                    }
                ]).exec(function(err, comments) {
                    // Check if places were found in database
                    if (!comments) {
                        res.json({ success: false, message: err }); // Return error of no places found
                    } else {
                        res.json({ success: true, comments: comments }); // Return success and place 
                    }
                });
            }
        }
    });
    /* ===============================================================
        Route to update/edit a comment
    =============================================================== */
    router.put('/editComment', function(req, res) {
        var language = req.body.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if id was provided
            if (!req.body._id) {
                res.json({ success: false, message: eval(language + '.editComment.idProvidedError') }); // Return error
            } else {
                // Check if comment was provided
                if (!req.body.comment) {
                    res.json({ success: false, message: eval(language + '.editComment.commentProvidedError') }); // Return error message
                } else {
                    // Check if comment createdBy was provided
                    if (!req.body.createdBy) {
                        res.json({ success: false, message: eval(language + '.editComment.createdByProvidedError') }); // Return error
                    } else {
                        var editUser = req.body.createdBy; // Assign _id from comment to be editted to a variable
                        if (req.body.firstParentId) var newCommentFirstParentId = req.body.firstParentId; // Check if a change to firstParentId was requested
                        if (req.body.parentId) var newCommentParentId = req.body.parentId; // Check if a change to parentId was requested
                        if (req.body.level) var newCommentLevel = req.body.level; // Check if a change to level was requested
                        if (req.body.eventId) var newCommentEventId = req.body.eventId; // Check if a change to eventIdLevel was requeste
                        if (req.body.mentionedUsers) var newCommentMentionedUsers = req.body.mentionedUsers; // Check if a change to mentionedUsers was requested
                        if (req.body.comment) var newCommentComment = req.body.comment; //Check if a change to comment was requested
                        if (req.body.createdBy) var newCommentCreatedBy = req.body.createdBy; // Check if a change to createdBy was requested
                        if (req.body.deleted !== undefined) var newCommentDeleted = req.body.deleted; // Check if a change to deleted was requested
                        // Look for logged in user in database to check if have appropriate access
                        User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
                            if (err) {
                                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                var mailOptions = {
                                    from: "Fred Foo 👻 <" + emailConfig.email + ">", // sender address
                                    to: [emailConfig.email],
                                    subject: ' Find one 1 edit comment error ',
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
                                                subject: ' Find one 2 edit comment error ',
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
                                                    // Look for comment in database
                                                    Comment.findOne({ _id: req.body._id }, function(err, comment) {
                                                        if (err) {
                                                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                                            var mailOptions = {
                                                                from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                                                to: [emailConfig.email],
                                                                subject: ' Find one 3 edit comment error ',
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
                                                            // Check if comment is in database
                                                            if (!comment) {
                                                                res.json({ success: false, message: eval(language + '.editUser.userError') }); // Return error
                                                            } else {
                                                                if (newCommentFirstParentId)
                                                                    comment.firstParentId = newCommentFirstParentId; // Assign new firstParentId to comment in database
                                                                if (newCommentParentId)
                                                                    comment.parentId = newCommentParentId; // Assign new parentId to comment in database
                                                                if (newCommentLevel)
                                                                    comment.level = newCommentLevel; // Assign new level to comment in database
                                                                if (newCommentEventId)
                                                                    comment.eventId = newCommentEventId; // Assign new eventIdLevel to comment in database
                                                                if (newCommentMentionedUsers) {
                                                                    var mentionedArray = [];
                                                                    for (var i = 0; i < newCommentMentionedUsers.length; i++) {
                                                                        mentionedArray.push({ username: newCommentMentionedUsers[i], readed: false });
                                                                    }
                                                                    comment.mentionedUsers = mentionedArray; // Assign new mentionedUsers to comment in database
                                                                }
                                                                if (newCommentComment)
                                                                    comment.comment = newCommentComment; // Assign newComment to comment in database
                                                                if (newCommentCreatedBy)
                                                                    comment.createdBy = newCommentCreatedBy; // Assign new createdBy to comment in database
                                                                if (newCommentDeleted !== undefined)
                                                                    comment.deleted = newCommentDeleted; // Assign new deleted to comment in database
                                                                comment.updatedAt = Date.now();
                                                                // Save comment into database
                                                                comment.save((err, comment) => {
                                                                    // Check if error
                                                                    if (err) {
                                                                        // Check if error is a validation error
                                                                        if (err.errors) {
                                                                            if (err.errors['comment']) {
                                                                                res.json({ success: false, message: eval(language + err.errors['comment'].message) }); // Return error message
                                                                            } else {
                                                                                res.json({ success: false, message: err }); // Return general error message
                                                                            }
                                                                        } else {
                                                                            res.json({ success: false, message: eval(language + '.editComment.saveError'), err }); // Return general error message
                                                                        }
                                                                    } else {
                                                                        res.json({ success: true, message: eval(language + '.editComment.success') }); // Return success message
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
        }
    });
    /* ===============================================================
         Route to update/edit a comments notification
     =============================================================== */
    router.put('/editCommentsNotification', function(req, res) {
        var language = req.body.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if id was provided
            if (!req.body.username) {
                res.json({ success: false, message: eval(language + '.editComment.usernameProvidedError') }); // Return error
            } else {
                // Look for logged in user in database to check if have appropriate access
                User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
                    if (err) {
                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                        var mailOptions = {
                            from: "Fred Foo 👻 <" + emailConfig.email + ">", // sender address
                            to: [emailConfig.email],
                            subject: ' Find one 1 edit comment error ',
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
                            User.findOne({ username: req.body.username }, function(err, user) {
                                if (err) {
                                    // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                    var mailOptions = {
                                        from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                        to: [emailConfig.email],
                                        subject: ' Find one 2 edit comment error ',
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
                                            Comment.update({
                                                //$or: [{ language: language }, { translation: { $elemMatch: { language: language } } }],
                                                $and: [{ "mentionedUsers.username": req.body.username }, { "mentionedUsers.readed": false }],
                                            }, { $set: { "mentionedUsers.$.readed": true } }, { multi: true }, function(err, comments) {
                                                // Check if error
                                                if (err) {
                                                    // Check if error is a validation error
                                                    if (err.errors) {
                                                        if (err.errors['comment']) {
                                                            res.json({ success: false, message: eval(language + err.errors['comment'].message) }); // Return error message
                                                        } else {
                                                            res.json({ success: false, message: err }); // Return general error message
                                                        }
                                                    } else {
                                                        res.json({ success: false, message: eval(language + '.editComment.saveError'), err }); // Return general error message
                                                    }
                                                } else {
                                                    res.json({ success: true, message: eval(language + '.editComment.success') }); // Return success message
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
        Route to delete a comment
    =============================================================== */
    router.delete('/deleteComment/:username/:id/:language', function(req, res) {
        var language = req.params.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            // Check if username was provided
            if (!req.params.username) {
                res.json({ success: false, message: eval(language + '.deleteComment.usernameProvidedError') }); // Return error
            } else {
                // Check if comment id was provided
                if (!req.params.id) {
                    res.json({ success: false, message: eval(language + '.deleteComment.idProvidedError') }); // Return error
                } else {
                    var deleteUser = req.params.username; // Assign the username from request parameters to a variable
                    // Look for logged in user in database to check if have appropriate access
                    User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
                        if (err) {
                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                            var mailOptions = {
                                from: "Fred Foo 👻 <" + emailConfig.email + ">", // sender address
                                to: [emailConfig.email],
                                subject: ' Find one 1 delete comment error ',
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
                                            subject: ' Find one 2 delete comment error ',
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
                                                Comment.findOneAndRemove({ _id: req.params.id }, function(err, comment) {
                                                    if (err) {
                                                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                                        var mailOptions = {
                                                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                                            to: [emailConfig.email],
                                                            subject: ' Find one and remove for delete comment ',
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
                                                        res.json({ success: true, message: eval(language + '.deleteComment.success') }); // Return success message
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