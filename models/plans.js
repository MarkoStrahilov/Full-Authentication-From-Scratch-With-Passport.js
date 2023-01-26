const mongoose = require('mongoose');

const Schema = new mongoose.Schema

const planSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        default: "Standard Plan"
    },
    credits: {
        type: Number,
        default: 0,
    }
}, { timestamps: true })

const Plan = mongoose.model("Plan", planSchema);
module.exports = Plan;