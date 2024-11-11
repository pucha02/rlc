const mongoose = require('mongoose');

const itemProductSchema = new mongoose.Schema({
    id: String,
    img: String,
    cost: String,
    name: String,
    species: String,
    category: String,
    subcategory: String,
    colors: [{ color: String, image: String }],
    colorImages: { type: mongoose.Schema.Types.Mixed },
    width: String,
    height: String,
    countryOfManufacture: String,
    materials: String,
    reviews: [{ username: String, rating: Number, text: String }]
});

const userSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String, unique: true }, // Ensure uniqueness for user emails
    phone: { type: String },
    password: { type: String },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});

// const orderSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',  },
//     items: [{ item: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemProduct' }, quantity: Number, name: String, cost: Number }],
//     totalCost: Number,
//     status: { type: String, default: 'Pending' }
// });

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User
    username: { type: String },
    email: { type: String }, // Removed 'unique: true'
    phone: { type: String }, // Removed 'unique: true'
    teacherName: { type: String },
    lang: { type: String }, // Removed 'unique: true'
    levelName: { type: String }, // Removed 'unique: true'
    time: { type: Array, default: 'Pending' },
    students: {type: Array},
    payment_status: {type: String}
});



const ItemProduct = mongoose.model('ItemProduct', itemProductSchema);
const User = mongoose.model('Users', userSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = {
    User,
    ItemProduct,
    Order
};
