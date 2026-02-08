const mongoose = require('mongoose')
const bookingSchema = mongoose.Schema(
    {
        booker: {
            type: String,
            required: [true, "Name Empty"],
            allowNull: false
        },
        comment: {
            type: String,
            required: false,
            allowNull: false
        },
        date: {
            type: String,
            required: [true, "Date Empty"],
            allowNull: false,
        },
        time: {
            type: String,
            required: [true, "Time Currency"],
            allowNull: false
        },
        email: {
            type: String,
            required: [true, "Email Empty"],
            allowNull: false,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: [true, "Phone number Empty"],
            allowNull: false
        }
    }
)
const Book = mongoose.model("Reservation", bookingSchema)

module.exports = Book