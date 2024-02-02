import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otpCode: {
        type: String,
        required: true
    },
    expireIn: {
        type: Number
    }
}, { timpestamps: true });

const OTP = mongoose.model("OTP", otpSchema)
export default OTP;