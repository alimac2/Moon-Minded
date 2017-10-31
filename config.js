exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                    //    "mongodb://admin:admin@ds149324.mlab.com:49324/moon-minded";
                       "mongodb://localhost/moon-minded";

exports.TEST_DATABASE_URL = (
	process.env.TEST_DATABASE_URL ||
    // "mongodb://admin:admin@ds155634.mlab.com:55634/test-moon-minded");
    "mongodb://localhost/test-moon-minded");
exports.PORT = process.env.PORT || 8080;