const  mongoose = require('mongoose')

const mySchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: [true, "please eneter name"]
        },
        siteLink:{
            type: String,
            required: true,
        },
        gitLink:{
            type: String,
            required: true,

        },
        tools:{
            type: String,
            required: true
        },
        image:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const myModel = mongoose.model('myModel', mySchema);

module.exports = myModel;