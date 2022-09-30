const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

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

// userSchema.methods.testBcryptPasswordResetToken = async function() {

//     const otp = `${Math.floor(Math.random() * 1000000000000000)}`
//     const hashedOtp = await bcrypt.hash(otp, 12)
//     const token = hashedOtp.toString()

//     // this.passwordResetToken = token
//     // this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

//     const data = { token, otp }

//     return data
// }


const User = mongoose.model('User', userSchema)
module.exports = User