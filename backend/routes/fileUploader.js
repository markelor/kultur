const User = require('../models/user'); // Import User Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
var aws = require('aws-sdk');
var multer = require('multer'); //require multer for the file uploads
var multerS3 = require('multer-s3');
var FroalaEditor = require('wysiwyg-editor-node-sdk');
const configAws = require('../config/aws'); // Import database configuration
const es = require('../translate/es'); // Import translate es
const eu = require('../translate/eu'); // Import translate eu
const en = require('../translate/en'); // Import translate en
const nodemailer = require('nodemailer');
const emailConfig = require('../config/email'); // email
module.exports = (router) => {
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
            user: emailConfig.email,
            pass: emailConfig.password
        }
    });

    router.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Credentials", true);
        next();
    });
    var s3 = new aws.S3(configAws);


    /* ===============================================================
        GET S3 options
    =============================================================== */
    router.get('/getSignatureFroala/:bucket/:language', (req, res) => {
        var language = req.params.language;
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            if (!req.params.bucket) {
                res.json({ success: false, message: eval(language + '.fileUpload.bucketError') });
            } else {
                var configs = {
                    // The name of your bucket.
                    bucket: 'culture-bucket',

                    // S3 region. If you are using the default us-east-1, it this can be ignored.
                    region: configAws.region,

                    // The folder where to upload the images.
                    keyStart: req.params.bucket + '/',

                    // File access.
                    acl: 'public-read',
                    // AWS keys.
                    accessKey: configAws.accessKeyId,
                    secretKey: configAws.secretAccessKey
                };

                var s3Hash = FroalaEditor.S3.getHash(configs);
                //res.send(s3Hash);
                res.json({ success: true, options: s3Hash }); // Return connection error
            }
        }
    });

    /* ===============================================================
       POST file uploader
    =============================================================== */
    router.post('/uploadImages/:bucket', function(req, res, next) {
        var language = req.params.language;
        if (!language) {
            language = "eu";
        }
        if (!req.params.bucket) {
            res.json({ success: false, message: eval(language + '.fileUpload.bucketError') });
        } else {
            var upload = multer({
                storage: multerS3({
                    s3: s3,
                    bucket: 'culture-bucket/' + req.params.bucket,
                    acl: 'public-read',
                    contentType: multerS3.AUTO_CONTENT_TYPE,
                    metadata: function(req, file, cb) {
                        cb(null, { fieldName: file.fieldname });
                    },
                    key: function(req, file, cb) {
                        cb(null, Date.now().toString() + "_" + file.originalname);
                    }
                })
            }).array(req.params.bucket, 10);

            upload(req, res, function(err) {
                if (err) {
                    res.json({ success: false, message: eval(language + '.fileUpload.uploadError') });
                } else {
                    res.json({ success: true, file: req.files, message: eval(language + '.fileUpload.uploadSuccess') });
                }
            });

        }
    });
    /* ===============================================================
       POST file uploader
    =============================================================== */
    router.post('/uploadImagesBase64', function(req, res) {
        var language = req.body.language;
        // Check if language was provided
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            if (!req.body.username) {
                res.json({ success: false, message: eval(language + '.fileUpload.usernameProvidedError') }); // Return error
            } else {
                if (!req.body.image) {
                    res.json({ success: false, message: eval(language + '.fileUpload.imageProvidedError') }); // Return error
                } else {
                    if (!req.body.bucket) {
                        res.json({ success: false, message: eval(language + '.fileUpload.bucketProvidedError') }); // Return error
                    } else {
                        if (!req.body.name) {
                            res.json({ success: false, message: eval(language + '.fileUpload.nameProvidedError') }); // Return error
                        } else {
                            var buf = new Buffer(req.body.image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                            var bucket = 'culture-bucket/' + req.body.bucket;
                            var key = Date.now().toString() + "_" + req.body.name;
                            var data = {
                                Bucket: bucket,
                                Key: key,
                                Body: buf,
                                ContentEncoding: 'base64',
                                ContentType: 'image/jpg'
                            };
                            s3.putObject(data, function(err, data) {
                                if (err) {
                                    res.json({ success: false, message: eval(language + '.fileUpload.uploadError') });
                                } else {
                                    // Look for logged in user in database to check if have appropriate access
                                    User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
                                        if (err) {
                                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                            var mailOptions = {
                                                from: "Fred Foo 👻 <" + emailConfig.email + ">", // sender address
                                                to: [emailConfig.email],
                                                subject: ' Find one 1 uploadImagesBase64 error ',
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
                                                User.findOne({ username: req.body.username }, function(err, user) {
                                                    if (err) {
                                                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                                        var mailOptions = {
                                                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                                            to: [emailConfig.email],
                                                            subject: ' Find one 2 edit uploadImagesBase64 ',
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
                                                            var url = 'https://s3-' + configAws.region + '.amazonaws.com/' + bucket + '/' + key;
                                                            // Check if is owner
                                                            if (mainUser._id.toString() === user._id.toString()) {
                                                                user.avatars.push(url); // Assign avats to user                                      
                                                            } else {
                                                                // Check if the current permission is 'admin'
                                                                if (mainUser.permission === 'admin') {
                                                                    // Check if user making changes has access
                                                                    if (user.permission === 'admin') {
                                                                        saveErrorPermission = language + '.general.adminOneError';
                                                                    } else {
                                                                        user.avatars.push(url); // Assign avats to user 
                                                                    }
                                                                } else {
                                                                    // Check if the current permission is moderator
                                                                    if (mainUser.permission === 'moderator') {
                                                                        // Check if contributor making changes has access
                                                                        if (user.permission === 'contributor') {
                                                                            user.avatars.push(url); // Assign avats to user
                                                                        } else {
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
                                                                        res.json({ success: true, url: url, message: eval(language + '.editUser.avatarUpload') }); // Return success message
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

                            });
                        }
                    }
                }
            }
        }
    });
    /* ===============================================================
       DELETE image file uploader
    =============================================================== */
    router.delete('/deleteProfileImage/:username/:imageId/:bucket/:language', function(req, res, next) {
        var language = req.params.language;
        var imageId = req.params.imageId;
        var bucket = "culture-bucket/" + req.params.bucket;
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else { // Check if username was provided
            if (!req.params.username) {
                res.json({ success: false, message: eval(language + '.fileUpload.usernameProvidedError') }); // Return error
            } else {
                if (!imageId) {
                    res.json({ success: false, message: eval(language + '.fileUpload.keyError') });
                } else {
                    if (!bucket) {
                        res.json({ success: false, message: eval(language + '.fileUpload.bucketError') });
                    } else {
                        s3.deleteObject({
                            Bucket: bucket,
                            Key: imageId
                        }, function(err, data) {
                            if (err) {
                                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                var mailOptions = {
                                    from: emailConfig.email,
                                    to: emailConfig.email,
                                    subject: 'Error deleteProfileImage',
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
                            } else {
                                // Look for logged in user in database to check if have appropriate access
                                User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
                                    if (err) {
                                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                        var mailOptions = {
                                            from: "Fred Foo 👻 <" + emailConfig.email + ">", // sender address
                                            to: [emailConfig.email],
                                            subject: ' Find one 1 deleteProfileImage error ',
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
                                            User.findOne({ username: req.params.username }, function(err, user) {
                                                if (err) {
                                                    // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                                    var mailOptions = {
                                                        from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                                                        to: [emailConfig.email],
                                                        subject: ' Find one 2 edit deleteProfileImage ',
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
                                                        var index = user.avatars.indexOf(imageId);
                                                        var saveErrorPermission = false;
                                                        // Check if is owner
                                                        if (mainUser._id.toString() === user._id.toString()) {
                                                            user.avatars.splice(index, 1); // Assign avats to user
                                                            user.currentAvatar = "assets/img/avatars/default-avatar.jpg";

                                                        } else {
                                                            // Check if the current permission is 'admin'
                                                            if (mainUser.permission === 'admin') {
                                                                // Check if user making changes has access
                                                                if (user.permission === 'admin') {
                                                                    saveErrorPermission = language + '.general.adminOneError';
                                                                } else {
                                                                    user.avatars.splice(index, 1); // Assign avats to user 
                                                                    user.currentAvatar = "assets/img/avatars/default-avatar.jpg";
                                                                }
                                                            } else {
                                                                // Check if the current permission is moderator
                                                                if (mainUser.permission === 'moderator') {
                                                                    // Check if contributor making changes has access
                                                                    if (user.permission === 'contributor') {
                                                                        user.avatars.splice(index, 1); // Assign avats to user
                                                                        user.currentAvatar = "assets/img/avatars/default-avatar.jpg";
                                                                    } else {
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
                                                                    res.json({ success: true, message: eval(language + '.fileUpload.deleteSuccess') }); // Return success message
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

                        });
                    }
                }
            }

        }

    });
    /* ===============================================================
           DELETE image file uploader
        =============================================================== */
    router.delete('/deleteImages/:imageId/:bucket/:language', function(req, res, next) {
        var language = req.params.language;
        var imageId = req.params.imageId;
        var bucket = "culture-bucket/" + req.params.bucket;
        if (!language) {
            res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
        } else {
            if (!imageId) {
                res.json({ success: false, message: eval(language + '.fileUpload.keyError') });
            } else if (!bucket) {
                res.json({ success: false, message: eval(language + '.fileUpload.bucketError') });
            } else {
                s3.deleteObject({
                    Bucket: bucket,
                    Key: imageId
                }, function(err, data) {
                    if (err) {
                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                        var mailOptions = {
                            from: emailConfig.email,
                            to: emailConfig.email,
                            subject: 'Error deleteImages',
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
                    } else {
                        res.json({ success: true, message: eval(language + '.fileUpload.deleteSuccess') });
                    }
                });
            }
        }
    });
    return router;
};