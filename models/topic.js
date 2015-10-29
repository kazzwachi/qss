var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    TopicSchema = new Schema({
        groupcode : String,
        threadnumber : String,
        sequence : {type: Number, dafault:0},
        type : String,
        subject : String,
        username : String,
        content : String,
        created : {type: Date , default: Date.now},
        updated : {type: Date , default: Date.now}
    });
module.exports = mongoose.model('Topic',TopicSchema);