var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    AccountSchema = new Schema({
    username : String,
    password : String,
    mail     : String,
    fullname : String,
    usertype : String,
    groupcode: String
});
AccountSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Account',AccountSchema);