"use strict"

const mongoose = require("mongoose");

const entrySchema = mongoose.Schema ({
    title: {type: String, required: true},
    eventType: String,
    content: {type: String}, 
    created: {type: Date, default: Date.now}
});

  
blogPostSchema.methods.apiRepr = function() {
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
