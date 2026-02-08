const mongoose = require('mongoose')
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name Empty"],
            allowNull: false
        },
        email: {
            type: String,
            required: [true, "Email Empty"],
            unique: true,
            allowNull: false
        },
        password: {
            type: String,
            required: [true, "Password Empty"],
            allowNull: false
        },
    }
)
const User = mongoose.model("User", userSchema)

module.exports = User