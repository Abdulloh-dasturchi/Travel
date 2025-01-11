const mongoose = require("mongoose");

const BuyTravelsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    travelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Travel",
        required: true,
    },
    people: [
        {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            gender: { 
                type: String, 
                enum: ["Mr", "Mrs", "Chd"], 
                required: true 
            },
            familyPosition: { type: String, required: true },
            nationality: { type: String, required: true },
            birthDate: {
                day: { type: Number, required: true },
                month: { type: String, required: true },
                year: { type: Number, required: true },
            },
            passport: {
                series: { type: String, required: true },
                number: { type: String, required: true },
                issuedDate: {
                    day: { type: Number, required: true },
                    month: { type: String, required: true },
                    year: { type: Number, required: true },
                },
                expiryDate: {
                    day: { type: Number, required: true },
                    month: { type: String, required: true },
                    year: { type: Number, required: true },
                },
            },
            phoneNumber: { type: String, required: true },
            email: { type: String, required: true },
            birthCountry: { type: String, required: true },
        },
    ],
}, {
    timestamps: true,
});

module.exports = mongoose.model("BuyTravel", BuyTravelsSchema);
