import mongoose from "mongoose";

const AppUserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
    },
    phone: {
        type: String,
    },
    address:{
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    date:{
        type: Date,
        default: Date.now
    },
    otp: {
        type: String,
    }

},
{
    collection: "MobileAppUsers",
},

{timestamps: true }
)

const User = mongoose.model("MobileAppUsers", AppUserSchema);
export default User;