"use strict"

const mongoose = require("mongoose");

const entrySchema = mongoose.Schema ({
    title: String,
    eventType: String,
    content: {type: String}, 
});

const Entry = mongoose.model("Entry", entrySchema);

module.exports = {Entry};
