module.exports = (req, res, next) => {
    if(process.env.DB_ENV !== 'testing') {
        console.log(`${req.method} to ${req.url} at ${new Date().toISOString()}`);
    }
    next();
};
