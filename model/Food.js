const mongoose = require('mongoose')
const foodSchema = mongoose.Schema(
    {
        id: {
            type: Number,
            required: [true, "ID empty"],
            unique: true,
            allowNull:false
        },
        img: {
            type: String,
            required: [true, "Image Empty"],
            allowNull: false
        },
        name: {
            type: String,
            required: [true, "Name Empty"],
            unique: true,
            allowNull: false,
            default: 'Dish Name'
        },
        description: {
            type: String,
            required: [true, "Description Empty"],
            unique: true,
            allowNull: false,
            default: 'Dish Description'
        },
        price: {
            type: Number,
            required: [true, "Price Empty"],
            allowNull: false,
            min: 0,
        },
        currency: {
            type: String,
            required: [true, "Choose Currency"],
            allowNull: false,
            validate: {
                validator: v => v.length === 1,
                message: 'Must be ONE character currency'
            },
            default: '$'
        },
        category: {
            type: String,
            required: [true, "Category Empty"],
            allowNull: false,
            enum: {
                values: ['starter', 'main', 'dessert', 'drink'],
                message: 'Category must be starter, main, dessert, or drink'
            },
            lowercase: true,
            trim: true
        },
        type: {
            type: String,
            required: [true, "Type of Food Empty"],
            allowNull: false,
            enum: {
                values: ['breakfast', 'soups', 'appetizers', 'mains', 'salads', 'seafood', 'fastfood', 'tea', 'coffee', 'milkshake', 'soda', 'icecream', 'cake', 'otherdessert'],
                message: 'Type must be from approved type list'
            },
            lowercase: true,
            trim: true
        }
    },
)
const Food = mongoose.model("Food", foodSchema)

module.exports = Food