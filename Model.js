const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    pictures:[{
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
    }]
})

const User = mongoose.model("user",userSchema);

module.exports = User;