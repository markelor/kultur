/* ===================
   Import Node Modules
=================== */
const express = require('express'); // Fast, unopinionated, minimalist web framework for node.
const app = express(); // Initiate Express Appplication
const router = express.Router(); // Creates a new router object.
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise;
const databaseConfig = require('./backend/config/database'); // Mongoose Config
const path = require('path'); // NodeJS Package for file paths
const authentication = require('./backend/routes/authentication')(router); // Import Authentication Routes
const category = require('./backend/routes/category')(router); // Import Category Routes
const event = require('./backend/routes/event')(router); // Import Event Routes
const place = require('./backend/routes/place')(router); // Import Place Routes
const application = require('./backend/routes/application')(router); // Import Application Routes
const service = require('./backend/routes/service')(router); // Import Service Routes
const serviceType = require('./backend/routes/serviceType')(router); // Import ServiceType Routes
const observation = require('./backend/routes/observation')(router); // Import Observation Routes
const comment = require('./backend/routes/comment')(router); // Import Comment Routes
const fileUploader = require('./backend/routes/fileUploader')(router); // Import File Uploader Routes
var bodyParser = require('body-parser'); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const cors = require('cors'); // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const port=process.env.PORT || 8080;
// Database Connection
mongoose.connect(databaseConfig.uri,{ useNewUrlParser: true }, (err) => {
    if (err) {
        console.log('Could NOT connect to database: ', err);
    } else {
        console.log('Connected to database: ' + databaseConfig.db);
    }
});

// Middleware
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json({limit: "50mb"})); // parse application/json
app.use(express.static(__dirname + '/src')); // Provide static directory for frontend
app.use('/authentication', authentication); // Use Authentication 
app.use('/event', event); // Use Event 
app.use('/category', category); // Use Category 
app.use('/place', place); // Use Place 
app.use('/application', application); // Use Application 
app.use('/service', service); // Use Service 
app.use('/serviceType', serviceType); // Use ServiceType 
app.use('/observation', observation); // Use Observation
app.use('/comment', comment); // Use Comment  
app.use('/fileUploader', fileUploader); // Use FileUploader
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/src/index.html'));
});

// Start Server: Listen on port 8080
app.listen(port, () => {
    console.log('Listening on port '+port);
});