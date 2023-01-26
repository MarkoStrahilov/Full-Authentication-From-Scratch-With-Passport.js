const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isDisabled: {
        type: Boolean,
        default: false
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Message"
    }],
    plan: {
        type: Schema.Types.ObjectId,
        ref: "Plan"
    },
    passwordResetToken: String,
    passwordResetExpires: Date
}, { timestamps: true })

userSchema.plugin(passportLocalMongoose)

userSchema.methods.createPasswordResetToken = async function() {

    const otp = `${Math.floor(Math.random() * 1000000000000000)}`
    const hashedOtp = await bcrypt.hash(otp, 12)

    this.passwordResetToken = hashedOtp
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return otp
}

const User = mongoose.model('User', userSchema)
module.exports = User