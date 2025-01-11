const mongoose = require("mongoose");

const userTravelSchema = new mongoose.Schema({
    from:{
        type:[String],
        required:true
    },
    to:{
        type:[String],
        required:true
    },
    takeOff:{
        type:mongoose.Schema.Types.Date, 
        required:true
    },
    takeOn:{
        type:mongoose.Schema.Types.Date,
        required:true,
    },
    howMuch:{
        type:Number,
        required:true
    },
    howMany:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    }
},{
    timestamps: true,
})


module.exports = mongoose.model("UserTravel",userTravelSchema)