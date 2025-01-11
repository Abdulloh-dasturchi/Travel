const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        math:[/^\[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"Invalid email"] 
    },
    avatar:{
        type:String,
        default:"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg",
    },
    password:{
        type:String,
        required:true,
        minLength:6,
        unique:true
    },
    telNumber:{
        type:String,
        required:true,
        minLength:12,
        unique:true 
    },
    adminStatus:{
        type:String,
        default:false,
    },
    apiKey:{
        type:String,
        required:true,
        unique:true,
    },
    travels:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Travel"
        }
    ],
    hotels:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Travel"
        }
    ],
    isActive:{
        type:Boolean,
        default:false,
    },
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Travel',
        },
    ],
    otp:{
        type:Number,
        default:null
    },
    userTravels:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"UserTravel"
        }
    ],
},{
    timestamps: true,
});

userSchema.pre("save", async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next()
})

// token 
userSchema.methods.getJWT = function (){
    return jwt.sign({id:this._id, email:this.email}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    })
}

// compare password 
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model("User",userSchema)