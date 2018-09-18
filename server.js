// These are important and needed before anything else
require('zone.js/dist/zone-node');
require('reflect-metadata');
const path=require('path');
const DIST_FOLDER = process.cwd(); // path.join(process.cwd(), 'dist');
const domino = require('domino');
const fs = require('fs');
const template = fs.readFileSync(path.join(DIST_FOLDER, 'browser', 'index.html')).toString();
const win = domino.createWindow(template);
global['localStorage'] = win.localStorage;
const prodMode=require('@angular/core');
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// Faster server renders w/ Prod mode (dev mode never needed)
prodMode.enableProdMode();

// Express server
const app = express();
const router = express.Router(); // Creates a new router object.
var bodyParser = require('body-parser'); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const cors = require('cors'); // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const PORT=process.env.PORT || 8080;

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const appServer = require('./dist/server/main.bundle');
// Express Engine
const ngUniversal = require('@nguniversal/express-engine');

// Import module map for lazy loading
const ngUniversalMap = require('@nguniversal/module-map-ngfactory-loader');

const databaseConfig = require('./backend/config/database'); // Mongoose Config
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

// Database Connection
mongoose.connect(databaseConfig.uri,{ useNewUrlParser: true }, (err) => {
    if (err) {
        console.log('Could NOT connect to database: ', err);
    } else {
        console.log('Connected to database: ' + databaseConfig.db);
    }
});
// ******************************************
// MIDDLEWARE
// ******************************************
// Cross-Origin Resource Sharing (CORS)
app.use(cors());
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json({limit: "50mb"})); // parse application/json
//app.use(express.static(__dirname + '/dist')); // Provide static directory for frontend
// ******************************************
// ROUTES
// ******************************************
// Server side-rendering of root route

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

app.engine('html', ngUniversal.ngExpressEngine({
  bootstrap: appServer.AppServerModuleNgFactory,
  providers: [
    ngUniversalMap.provideModuleMap(appServer.LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', path.join(DIST_FOLDER, 'browser'));

// TODO: implement data requests securely
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});

// Server static files from /browser
app.get('*.*', express.static(path.join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  var seeArr = req.originalUrl.split('/');
  seeArr.pop();
  var seeUrl=seeArr.join('/');
  if(req.originalUrl==='/eu' || req.originalUrl==='/es' || req.originalUrl==='/en'||
    req.originalUrl==='/eu/mapa' ||  req.originalUrl==='/es/mapa' ||  req.originalUrl==='/en/map' ||
    seeUrl==='/eu/ekintza/ikusi' ||  seeUrl==='/es/ver/evento' ||  seeUrl==='/en/see/event'){
    res.render(path.join(DIST_FOLDER, 'browser', 'index.html'), {
      req: req,
      res: res
    }); 
  }else{  
    res.sendFile(path.join(path.join(DIST_FOLDER, 'browser','index.html')));
  }

 
});
/*app.get('*', (req, res) => {
    res.sendFile(path.join(path.join(DIST_FOLDER, 'browser','index.html')));
});*/

// Start up the Node server
app.listen(PORT,() => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});

