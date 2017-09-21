"use strict"

const mongoose = require("mongoose");

const entrySchema = mongoose.Schema ({
    title: {type: String},
    eventType: {type: String},
    content: {type: String}, 
});

const Entry = mongoose.model('Entry', entrySchema);

module.exports = {Entry};
