const generateDataJson = require('../utils/generateDataJson');

const autoExport = (req, res, next) => {
    // Only trigger export on data mutation requests
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        // Wait for the response to finish successfully before exporting
        res.on('finish', () => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                // Run asynchronously so we don't block
                generateDataJson();
            }
        });
    }
    next();
};

module.exports = autoExport;
