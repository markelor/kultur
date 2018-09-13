const User = require('../models/user'); // Import User Model Schema
const Application = require('../models/application'); // Import Application Model Schema
const Event = require('../models/event'); // Import Event Model Schema
const Place = require('../models/place'); // Import Event Model Schema
const Service = require('../models/service'); // Import Service Model Schema
const Observation = require('../models/observation'); // Import observation Model Schema
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
     CREATE NEW application
  =============================================================== */
  router.post('/newApplication', (req, res) => {
    var language = req.body.language;
    // Check if language was provided
    if (!language) {
      res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
    } else {
      // Check if application moderators was provided
      if (!req.body.moderators || req.body.moderators.length <= 0) {
        res.json({ success: false, message: eval(language + '.newApplication.moderatorsProvidedError') }); // Return error
      } else {
        for (var i = 0; i < req.body.moderators.length; i++) {
          req.body.moderators[i] = ObjectId(req.body.moderators[i]);
        }
        // Check if application title was provided
        if (!req.body.title) {
          res.json({ success: false, message: eval(language + '.newApplication.titleProvidedError') }); // Return error
        } else {
          // Check if application licenseName was provided
          if (!req.body.licenseName) {
            res.json({ success: false, message: eval(language + '.newApplication.licenseNameProvidedError') }); // Return error message
          } else {
            // Check if application conditions was provided
            if (!req.body.conditions || req.body.conditions.length <= 0) {
              res.json({ success: false, message: eval(language + '.newApplication.conditionsProvidedError') }); // Return error message
            } else {
              // Check if application price was provided
              if (!req.body.price) {
                res.json({ success: false, message: eval(language + '.newApplication.priceProvidedError') }); // Return error message
              } else {
                // Check if application expiredAt was provided
                if (!req.body.expiredAt) {
                  res.json({ success: false, message: eval(language + '.newApplication.expiredAtProvidedError') }); // Return error message
                } else {
                  // Check if application expiredAt was provided
                  if (!req.body.imagesApplication) {
                    res.json({ success: false, message: eval(language + '.newApplication.imagesProvidedError') }); // Return error message
                  } else {
                    if (req.body.contributors) {
                      for (var i = 0; i < req.body.contributors.length; i++) {
                        req.body.contributors[i] = ObjectId(req.body.contributors[i]);
                      }
                    }
                    User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
                      if (err) {
                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                        var mailOptions = {
                          from: "Fred Foo 👻 <" + emailConfig.email + ">", // sender address
                          to: [emailConfig.email],
                          subject: ' Find one 1 newApplication error ',
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
                          res.json({ success: false, message: eval(language + '.newApplication.userError') }); // Return error
                        } else {
                          // Check if is admin or moderator
                          if (mainUser.permission !== 'admin') {
                            res.json({ success: false, message: eval(language + '.general.permissionError') }); // Return error
                          } else {
                            User.updateMany({
                              $and: [{ _id: req.body.contributors }, { permission: "user" }]
                            }, { $set: { permission: "contributor" } }, function(err, user) {
                              // Check if error
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
                                User.updateMany({
                                  _id: req.body.moderators,
                                  $or: [{ permission: "contributor" }, { permission: "user" }]
                                }, { $set: { permission: "moderator" } }, function(err, user) {
                                  // Check if error
                                  if (err) {
                                    console.log(err);
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
                                    const application = new Application({
                                      language: language,
                                      moderators: req.body.moderators,
                                      contributors: req.body.contributors,
                                      title: req.body.title,
                                      events: req.body.events,
                                      entityName: req.body.entityName,
                                      licenseName: req.body.licenseName,
                                      conditions: req.body.conditions,
                                      price: req.body.price,
                                      expiredAt: req.body.expiredAt,
                                      images: req.body.imagesApplication,
                                      createdAt: Date.now(),
                                      updatedAt: Date.now()
                                    });
                                    // Save application into database
                                    application.save((err, application) => {
                                      // Check if error
                                      if (err) {
                                        console.log(err);
                                        // Check if error is a validation error
                                        if (err.errors) {
                                          // Check if validation error is in the application field
                                          if (err.errors['title']) {
                                            res.json({ success: false, message: eval(language + err.errors['title'].message) }); // Return error message
                                          } else {
                                            if (err.errors['entityName']) {
                                              res.json({ success: false, message: eval(language + err.errors['entityName'].message) }); // Return error message
                                            } else {
                                              res.json({ success: false, message: err }); // Return general error message
                                            }
                                          }
                                        } else {
                                          res.json({ success: false, message: eval(language + '.newApplication.saveError'), err }); // Return general error message
                                        }
                                      } else {
                                        res.json({ success: true, message: eval(language + '.newApplication.success'), application: application }); // Return success message
                                      }
                                    });
                                  }
                                });
                              }
                            });
                          }
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
  });
  /* ===============================================================
         GET Application
      =============================================================== */
  router.get('/getApplicationEvents/:id/:userId/:language', (req, res) => {
    var language = req.params.language;
    if (!language) {
      res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
    } else {
      if (!req.params.id) {
        res.json({ success: false, message: eval(language + '.getApplication.idProvidedError') }); // Return error
      } else {
        if (!req.params.userId) {
          res.json({ success: false, message: eval(language + '.getEvent.userIdProvidedError') }); // Return error
        } else {
          Application.findOne({
            _id: ObjectId(req.params.id)
          }, (err, application) => {
            // Check if error was found or not
            if (err) {
              // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
              var mailOptions = {
                from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                to: [emailConfig.email], // list of receivers
                subject: ' Find 31get application events error ',
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
              // Check if application were found in database
              if (!application) {
                res.json({ success: false, message: eval(language + '.getApplication.applicationError') }); // Return error of no application found
              } else {
                User.find({
                  _id: { $in: application.moderators }
                }, (err, moderators) => {
                  // Check if error was found or not
                  if (err) {
                    // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                    var mailOptions = {
                      from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                      to: [emailConfig.email], // list of receivers
                      subject: ' Find 2 get application events error ',
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
                    // Check if application were found in database
                    if (!moderators) {
                      res.json({ success: false, message: eval(language + '.getApplication.applicationError') }); // Return error of no application found
                    } else {
                      User.find({
                        _id: { $in: application.contributors }
                      }, (err, contributors) => {
                        // Check if error was found or not
                        if (err) {
                          // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                          var mailOptions = {
                            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                            to: [emailConfig.email], // list of receivers
                            subject: ' Find 3 get application events error ',
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
                          // Check if application were found in database
                          if (!contributors) {
                            res.json({ success: false, message: eval(language + '.getApplication.applicationError') }); // Return error of no application found
                          } else {
                            //res.json({ success: true, application: application }); // Return success and place 
                            var filtersEvent = { _id: { $in: application.events } };
                            for (var i = 0; i < application.contributors.length; i++) {
                              if (application.contributors[i].toString() === req.params.userId.toString()) {
                                filtersEvent['$or'] = [{ createdBy: ObjectId(req.params.userId) }, { translation: { $elemMatch: { createdBy: ObjectId(req.params.userId) } } }];
                              }
                            }
                            Event.aggregate([{
                                $match: filtersEvent
                              }, {
                                // Join with User table
                                $lookup: {
                                  from: "users",
                                  localField: "createdBy",
                                  foreignField: "_id",
                                  as: "user"
                                }
                              }, { $unwind: "$user" }, {
                                // Join with Place table
                                $lookup: {
                                  from: "places", // other table name
                                  localField: "placeId", // placeId of Event table field
                                  foreignField: "_id", // _id of Place table field
                                  as: "place" // alias for userinfo table
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
                                res.json({ success: false, message: eval(language + '.eventsSearch.placesError') }); // Return error of no places found
                              } else {
                                res.json({ success: true, application: application, events: events, moderatorsArray: moderators, contributorsArray: contributors }); // Return success and place 
                              }
                            });

                          }
                        }
                      });

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
             GET Application
          =============================================================== */
  router.get('/getApplicationServices/:id/:userId/:language', (req, res) => {
    var language = req.params.language;
    if (!language) {
      res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
    } else {
      if (!req.params.id) {
        res.json({ success: false, message: eval(language + '.getApplication.idProvidedError') }); // Return error
      } else {
        if (!req.params.userId) {
          res.json({ success: false, message: eval(language + '.getService.userIdProvidedError') }); // Return error
        } else {
          Application.findOne({
            _id: ObjectId(req.params.id)
          }, (err, application) => {
            // Check if error was found or not
            if (err) {
              // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
              var mailOptions = {
                from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                to: [emailConfig.email], // list of receivers
                subject: ' Find 1 get application services error ',
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
              // Check if application were found in database
              if (!application) {
                res.json({ success: false, message: eval(language + '.getApplication.applicationError') }); // Return error of no application found
              } else {
                var filtersService = { _id: { $in: application.services } };
                for (var i = 0; i < application.contributors.length; i++) {
                  if (application.contributors[i].toString() === req.params.userId.toString()) {
                    filtersService['$or'] = [{ createdBy: ObjectId(req.params.userId) }, { translation: { $elemMatch: { createdBy: ObjectId(req.params.userId) } } }];
                  }
                }
                Service.aggregate([{
                    $match: filtersService
                  }, {
                    // Join with User table
                    $lookup: {
                      from: "users",
                      localField: "createdBy",
                      foreignField: "_id",
                      as: "user"
                    }
                  }, { $unwind: "$user" }, {
                    // Join with Place table
                    $lookup: {
                      from: "places", // other table name
                      localField: "placeId", // placeId of Event table field
                      foreignField: "_id", // _id of Place table field
                      as: "place" // alias for userinfo table
                    }
                  }, { $unwind: "$place" },
                  // Join with Category table
                  {
                    $lookup: {
                      from: "servicetypes",
                      localField: "serviceTypeId",
                      foreignField: "_id",
                      as: "serviceType"
                    }
                  }, { $unwind: "$serviceType" },
                ]).exec(function(err, services) {
                  // Check if places were found in database
                  if (!services) {
                    res.json({ success: false, message: eval(language + '.newService.servicesError') }); // Return error of no observations found
                  } else {
                    res.json({ success: true, application: application, services: services }); // Return success and place 
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
                 GET Application
              =============================================================== */
  router.get('/getApplicationObservations/:id/:userId/:language', (req, res) => {
    var language = req.params.language;
    if (!language) {
      res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
    } else {
      if (!req.params.id) {
        res.json({ success: false, message: eval(language + '.getApplication.idProvidedError') }); // Return error
      } else {
        if (!req.params.userId) {
          res.json({ success: false, message: eval(language + '.getObservation.userIdProvidedError') }); // Return error
        } else {
          Application.findOne({
            _id: ObjectId(req.params.id)
          }, (err, application) => {
            // Check if error was found or not
            if (err) {
              // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
              var mailOptions = {
                from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                to: [emailConfig.email], // list of receivers
                subject: ' Find 1 get application observations error ',
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
              // Check if application were found in database
              if (!application) {
                res.json({ success: false, message: eval(language + '.getApplication.applicationError') }); // Return error of no application found
              } else {
                var filtersObservation = { _id: { $in: application.observations } };
                for (var i = 0; i < application.contributors.length; i++) {
                  if (application.contributors[i].toString() === req.params.userId.toString()) {
                    filtersObservation['$or'] = [{ createdBy: ObjectId(req.params.userId) }, { translation: { $elemMatch: { createdBy: ObjectId(req.params.userId) } } }];
                  }
                }
                Observation.aggregate([{
                  $match: filtersObservation
                }, {
                  // Join with User table
                  $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "user"
                  }
                }, { $unwind: "$user" }]).exec(function(err, observations) {
                  // Check if observation is in database
                  if (!observations) {
                    res.json({ success: false, message: eval(language + '.newObservation.observationsError') }); // Return error of no observations found
                  } else {
                    res.json({ success: true, application: application, observations: observations }); // Return success and place 
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
           GET Application
        =============================================================== */
  router.get('/getApplicationContributors/:id/:language', (req, res) => {
    var language = req.params.language;
    if (!language) {
      res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
    } else {
      if (!req.params.id) {
        res.json({ success: false, message: eval(language + '.getApplication.idProvidedError') }); // Return error
      } else {
        Application.findOne({
          _id: ObjectId(req.params.id)
        }, (err, application) => {
          // Check if error was found or not
          if (err) {
            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
            var mailOptions = {
              from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
              to: [emailConfig.email], // list of receivers
              subject: ' Find 1 get application contributors error ',
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
            // Check if application were found in database
            if (!application) {
              res.json({ success: false, message: eval(language + '.getApplication.applicationError') }); // Return error of no application found
            } else {
              // Look for users in database
              User.find({ _id: { $in: application.contributors } }, function(err, contributors) {
                if (err) {
                  // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                  var mailOptions = {
                    from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                    to: [emailConfig.email],
                    subject: ' Find 2 get application contributors error ',
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
                  if (!contributors) {
                    res.json({ success: false, message: eval(language + '.editUser.userError') }); // Return error
                  } else {
                    res.json({ success: true, application: application, contributors: contributors }); // Return success and place 
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
         GET Applications
      =============================================================== */
  router.get('/getApplications/:language', (req, res) => {
    var language = req.params.language;
    if (!language) {
      res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
    } else {
      Application.find({}).sort({ '_id': 1 }).exec((err, applications) => {
        // Check if error was found or not
        if (err) {
          // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
          var mailOptions = {
            from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
            to: [emailConfig.email], // list of receivers
            subject: ' Find 1 get applications error ',
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
          // Check if applications were found in database
          if (!applications) {
            res.json({ success: false, message: eval(language + '.userApplications.applicationsError') }); // Return error of no applications found
          } else {
            res.json({ success: true, applications: applications }); // Return success and applications array
          }
        }
      }); // Sort applications from newest to oldest

    }

  });
  /* ===============================================================
         GET ALL user applications
      =============================================================== */
  router.get('/userApplications/:userId/:language', (req, res) => {
    var language = req.params.language;
    if (!language) {
      res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
    } else {
      // Look for logged in user in database to check if have appropriate access
      User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
        if (err) {
          // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
          var mailOptions = {
            from: "Fred Foo 👻 <" + emailConfig.email + ">", // sender address
            to: [emailConfig.email],
            subject: ' Find one 1 all user applications error ',
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
            res.json({ success: false, message: eval(language + '.userApplications.userError') }); // Return error
          } else {
            if (mainUser.permission === 'admin' || mainUser.permission === 'moderator' || mainUser.permission === 'contributor') {
              var filter = {};
              if (req.params.userId !== "undefined") {
                filter.$or = [{ moderators: ObjectId(req.params.userId) }, { contributors: ObjectId(req.params.userId) }];
              }
              Application.find(filter).sort({ 'expiredAt': 1 }).exec((err, applications) => {
                // Check if error was found or not
                if (err) {
                  // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                  var mailOptions = {
                    from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                    to: [emailConfig.email], // list of receivers
                    subject: ' Find 3 all user applications error ',
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
                  // Check if applications were found in database
                  if (!applications) {
                    res.json({ success: false, message: eval(language + '.userApplications.applicationsError') }); // Return error of no applications found
                  } else {
                    res.json({ success: true, applications: applications }); // Return success and applications array
                  }
                }
              }); // Sort applications by expired date
            }
          }
        }
      });

    }
  });
  /* ===============================================================
          Route to update/edit a application
      =============================================================== */
  router.put('/editApplication', function(req, res) {
    var language = req.body.language;
    // Check if language was provided
    if (!language) {
      res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
    } else {
      // Check if id was provided
      if (!req.body._id) {
        res.json({ success: false, message: eval(language + '.editApplication.idProvidedError') }); // Return error
      } else {

        // Check if application moderators was provided
        if (!req.body.moderators || req.body.moderators.length <= 0) {
          res.json({ success: false, message: eval(language + '.editApplication.moderatorsProvidedError') }); // Return error
        } else {
          for (var i = 0; i < req.body.moderators.length; i++) {
            req.body.moderators[i] = ObjectId(req.body.moderators[i]);
          }
          if (req.body.contributors) {
            for (var i = 0; i < req.body.contributors.length; i++) {
              req.body.contributors[i] = ObjectId(req.body.contributors[i]);
            }
          }
          if (req.body.language) var newLanguage = req.body.language; // Check if a change to language was requested
          if (req.body.moderators) var newModerators = req.body.moderators; // Check if a change to moderators was requested
          if (req.body.contributors) var newContributors = req.body.contributors; // Check if a change to contributors was requested
          if (req.body.title) var newTitle = req.body.title; // Check if a change to title was requested
          if (req.body.events) var newEvents = req.body.events; // Check if a change to events was requested
          if (req.body.services) var newServices = req.body.services; // Check if a change to services was requested
          if (req.body.observations) var newObservations = req.body.observations; // Check if a change to observations was requested
          if (req.body.entityName) var newEntityName = req.body.entityName; // Check if a change to entityName was requested
          if (req.body.liceseName) var newLicenseName = req.body.liceseName; // Check if a change to name was requested
          if (req.body.conditions) var newConditions = req.body.conditions; // Check if a change to conditions was requested
          if (req.body.price) var newPrice = req.body.price; // Check if a change to price was requested
          if (req.body.expiredAt) var newExpiredAt = req.body.expiredAt; // Check if a change to expiredAt was requested
          if (req.body.images) var newImages = req.body.images; // Check if a change to images was requested
          if (req.body.translation) var newTranslation = req.body.translation; // Check if a change to translation was requested
          // Look for logged in user in database to check if have appropriate access
          User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
            if (err) {
              // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
              var mailOptions = {
                from: "Fred Foo 👻 <" + emailConfig.email + ">", // sender address
                to: [emailConfig.email],
                subject: ' Find one 1 edit application error ',
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
                // Look for users in database
                User.find({ $or: [{ _id: req.body.moderators }, { _id: req.body.contributors }] }, function(err, users) {
                  if (err) {
                    // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                    var mailOptions = {
                      from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                      to: [emailConfig.email],
                      subject: ' Find 2 edit application error ',
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
                    if (users.length <= 0) {
                      res.json({ success: false, message: eval(language + '.editUser.userError') }); // Return error
                    } else {
                      var saveErrorPermission = false;
                      // Check if is owner
                      var exists = false;
                      for (var i = 0; i < users.length; i++) {
                        if (users[i]._id.toString() === mainUser._id.toString()) {
                          exists = true;
                        }
                      }
                      if (!exists) {
                        if (mainUser.permission !== 'admin') {
                          saveErrorPermission = language + '.general.permissionError';
                        }
                      }
                      //check saveError permision to save changes or not
                      if (saveErrorPermission) {
                        res.json({ success: false, message: eval(saveErrorPermission) }); // Return error
                      } else {
                        // Look for application in database
                        Application.findOne({ _id: ObjectId(req.body._id) }, function(err, application) {
                          if (err) {
                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                            var mailOptions = {
                              from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                              to: [emailConfig.email],
                              subject: ' Find one 3 edit application error ',
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
                            // Check if application is in database
                            if (!application) {
                              res.json({ success: false, message: eval(language + '.editUser.userError') }); // Return error
                            } else {
                              if (newLanguage)
                                application.language = newLanguage; // Assign new language to application in database
                              if (newModerators)
                                application.moderators = newModerators; // Assign new moderators to application in database
                              if (newContributors)
                                application.contributors = newContributors; // Assign new contributors to application in database
                              if (newTitle)
                                application.title = newTitle; // Assign new title to application in database
                              if (newEvents)
                                application.events = newEvents; // Assign new events to application in database
                              if (newServices)
                                application.services = newServices; // Assign new services to application in database
                              if (newObservations)
                                application.observations = newObservations; // Assign new observations to application in database
                              if (newEntityName)
                                application.entityName = newEntityName; // Assign new entityName to application in database
                              if (newLicenseName)
                                application.licenseName = newLicenseName; // Assign new name to application in database
                              if (newConditions)
                                application.conditions = newConditions; // Assign new conditions to application in database
                              if (newPrice)
                                application.price = newPrice; // Assign new price to application in database
                              if (newExpiredAt)
                                application.expiredAt = newExpiredAt; // Assign new expiredAt to application in database
                              if (newImages)
                                application.images = newImages; // Assign new Images to application in database
                              if (newTranslation)
                                application.translation = newTranslation; // Assign new Translation to application in database
                              application.updatedAt = Date.now();
                              // Save application into database
                              function saveApplication() {
                                application.save((err, application) => {
                                  // Check if error
                                  if (err) {
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
                                      res.json({ success: false, message: eval(language + '.editApplication.saveError'), err }); // Return general error message
                                    }
                                  } else {
                                    res.json({ success: true, message: eval(language + '.editApplication.success') }); // Return success message
                                  }
                                });
                              }

                              function updateUser(usersArray, currentPermission, newPermission) {
                                User.updateMany({
                                  _id: usersArray,
                                  permission: currentPermission
                                }, { $set: { permission: newPermission } }, function(err, user) {
                                  // Check if error
                                  if (err) {
                                    console.log(err);
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
                                  }
                                });
                              }

                              function downgradeContributorPermissionApplications(moderatorsArray) {
                                var conditionMatch;
                                if (!moderatorsArray) {
                                  conditionMatch = req.body.deletedContributors;
                                } else {
                                  conditionMatch = moderatorsArray;
                                }
                                Application.aggregate([ // Join with Place table
                                  {
                                    $match: { contributors: { $in: conditionMatch } }
                                  }, { $unwind: "$contributors" },
                                  {
                                    $group: {
                                      _id: "$contributors",
                                      count: { $sum: 1 }
                                    }
                                  }
                                ]).exec(function(err, contributors) {
                                  if (err) {
                                    console.log(err);
                                    res.json({ success: false, message: err }); // Error if cannot connect
                                  } else {
                                    var contributorsArray = [];
                                    for (var i = 0; i < contributors.length; i++) {
                                      if (contributors[i].count === 1) {
                                        contributorsArray.push(contributors[i]._id);
                                      }
                                    }
                                    if (contributorsArray.length > 0 && !moderatorsArray) {
                                      updateUser(contributorsArray, "contributor","user");
                                      upgradeContributorPermissionApplications();
                                    } else if (contributorsArray.length === 0 && moderatorsArray) {
                                      updateUser(moderatorsArray, "moderator","user");
                                      upgradeModeratorPermissionApplications();
                                    } else if(contributorsArray.length >0 && moderatorsArray) {
                                      upgradeContributorPermissionApplications();
                                      updateUser(contributorsArray, "moderator","contributor");
                                    }
                                  }
                                });
                              }

                              function downgradeModeratorPermissionApplications() {
                                Application.aggregate([ // Join with Place table
                                  {
                                    $match: { moderators: { $in: req.body.deletedModerators } }
                                  }, { $unwind: "$moderators" },
                                  {
                                    $group: {
                                      _id: "$moderators",
                                      count: { $sum: 1 }
                                    }
                                  }
                                ]).exec(function(err, moderators) {
                                  if (err) {
                                    console.log(err);
                                    res.json({ success: false, message: err }); // Error if cannot connect
                                  } else {
                                    var moderatorsArray = [];
                                    for (var i = 0; i < moderators.length; i++) {
                                      if (moderators[i].count === 1) {
                                        moderatorsArray.push(moderators[i]._id);
                                      }
                                    }
                                    if (moderatorsArray.length > 0) {
                                      downgradeContributorPermissionApplications(moderatorsArray);
                                    }else{
                                      upgradeModeratorPermissionApplications();
                                    }
                                  }
                                });
                              }

                              function upgradeModeratorPermissionApplications() {
                                User.updateMany({
                                  _id: req.body.moderators,
                                  $or: [{ permission: "contributor" }, { permission: "user" }]
                                }, { $set: { permission: "moderator" } }, function(err, user) {
                                  // Check if error
                                  if (err) {
                                    console.log(err);
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

                                  }
                                });

                              }
                              function upgradeContributorPermissionApplications() {
                                User.updateMany({
                                  $and: [{ _id: req.body.contributors }, { permission: "user" }]
                                }, { $set: { permission: "contributor" } }, function(err, user) {
                                  // Check if error
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

                                  }
                                });
                              }
                              if (req.body.deletedModerators.length > 0) {
                                for (var i = 0; i < req.body.deletedModerators.length; i++) {
                                  req.body.deletedModerators[i] = ObjectId(req.body.deletedModerators[i]);
                                }
                                downgradeModeratorPermissionApplications();
                              } else {
                                upgradeModeratorPermissionApplications();
                              }
                              if (req.body.deletedContributors.length > 0) {
                                for (var i = 0; i < req.body.deletedContributors.length; i++) {
                                  req.body.deletedContributors[i] = ObjectId(req.body.deletedContributors[i]);
                                }
                                downgradeContributorPermissionApplications(undefined);
                              } else {
                                upgradeContributorPermissionApplications();
                              }
                              saveApplication();
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
          Route to delete a application
      =============================================================== */
  router.delete('/deleteApplication/:userId/:id/:language', function(req, res) {
    var language = req.params.language;
    // Check if language was provided
    if (!language) {
      res.json({ success: false, message: "Ez da hizkuntza aurkitu" }); // Return error
    } else {
      // Check if userId was provided
      if (!req.params.userId) {
        res.json({ success: false, message: eval(language + '.deleteApplication.userIdProvidedError') }); // Return error
      } else {
        // Check if application id was provided
        if (!req.params.id) {
          res.json({ success: false, message: eval(language + '.deleteApplication.idProvidedError') }); // Return error
        } else {
          var deleteUser = ObjectId(req.params.userId); // Assign the userId from request parameters to a variable
          // Look for logged in user in database to check if have appropriate access
          User.findOne({ _id: req.decoded.userId }, function(err, mainUser) {
            if (err) {
              // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
              var mailOptions = {
                from: "Fred Foo 👻 <" + emailConfig.email + ">", // sender address
                to: [emailConfig.email],
                subject: ' Find one 1 delete application error ',
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
                User.findOne({ _id: deleteUser }, function(err, user) {
                  if (err) {
                    // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                    var mailOptions = {
                      from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                      to: [emailConfig.email],
                      subject: ' Find one 2 delete application error ',
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
                        Application.findOneAndRemove({ _id: req.params.id }, function(err, application) {
                          if (err) {
                            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                            var mailOptions = {
                              from: "Fred Foo 👻" < +emailConfig.email + ">", // sender address
                              to: [emailConfig.email],
                              subject: ' Find one and remove for delete application ',
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
                            res.json({ success: true, message: eval(language + '.deleteApplication.success') }); // Return success message
                          }

                          function deleteImages(images, bucket) {
                            var imagesKey = [];
                            for (var i = 0; i < images.length; i++) {
                              if (bucket === "application") {
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
                                  subject: 'Error delete images application',
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

                              }
                            });
                          }
                          if (application.images.length > 0) {
                            deleteImages(application.images, "application");
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
