// const express = require("express");
// const app = express();
// app.use(express.static("public"));
// app.listen(process.env.PORT || 8080);


exports.DATABASE_URL = process.env.DATABASE_URL ||
global.DATABASE_URL ||
"mongodb://localhost/moon-minded";
exports.PORT = process.env.PORT || 8080;