const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name!"]
    },
    email: {
        type: String,
        required: [true, "Please provide your email!"],
        validate: [validator.isEmail, "Please provide a valid email address"],
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: ["seller", "user"],
        default: "user"
    },
    password: {
        type: String,
        required: [true, "Please provide your password!"],
        minlength: [8, "Password must have min length of 8"],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            //This only works on CREATE and SAVE!!
            validator: function(el) {
                return el === this.password;
            },
            message: "Passwords are not same"
        }
    }
});

userSchema.pre("save", async function(next) {
    //Only run this function if password is modified
    if (!this.isModified("password")) return next();

    //Hashed the password at cost 14
    this.password = await bcrypt.hash(this.password, 14);

    //Delete passwordConfirm
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(
    candiatePassword,
    userPassword
) {
    return await bcrypt.compare(candiatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
