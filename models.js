"use strict"

const mongoose = require("mongoose");

const entrySchema = mongoose.Schema ({
    title: {type: String, required: true},
    eventType: String,
    content: {type: String}, 
    created: {type: String, default: Date.now}
});


// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data  
entrySchema.methods.apiRepr = function() {
    return {
      id: this._id,
      title: this.title,
      eventType: this.eventType,
      content: this.content,
      created: this.created
    }; 
}

const Entry = mongoose.model("Entry", entrySchema);

module.exports = {Entry};
