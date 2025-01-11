const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
    nameUz: {
        type: String,
        required: true,
    },
    nameRu: {
        type: String,
        required: true,
    },      
    nameEn: {
        type: String,
        required: true,
    },
    flag: {
        type: String,
    }, 
},{
    timestamps: true
});

module.exports = mongoose.model("Country", countrySchema);
    