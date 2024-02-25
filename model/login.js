const mongoose = require('mongoose')

const loginSchema = mongoose.Schema({
        userName:{
            type:String,
            required: true
        },
        password:{
            type:String,
            required:true
        }
},

{
    timestamps: true
}
)

const login = mongoose.model("login", loginSchema);

module.exports = login;