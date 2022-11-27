const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pictureSchema = new Schema({
    background:{
        type: String,
        required: true
    },
    fontFamily:{
        type: String,
        required: true
    },
    valquote:{
        type: String,
        required: true
    },
    valinput:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    } 
})

const Picture = mongoose.model("picture",pictureSchema);

module.exports = Picture;