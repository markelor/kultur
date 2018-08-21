module.exports.serverRouter = (req, res, next) => {
    // Exception handling for API calls
    //return next();
    // Server-side rendering
    console.log(req.url);
    res.render(join(__dirname + '/dist', 'index.html'), { req, res });
}