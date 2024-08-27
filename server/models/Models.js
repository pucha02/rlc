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
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    password: { type: String, required: true },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }]
});

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{ item: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemProduct' }, quantity: Number, name: String, cost: Number }],
    totalCost: Number,
    status: { type: String, default: 'Pending' }
});

const ItemProduct = mongoose.model('ItemProduct', itemProductSchema);
const User = mongoose.model('Users', userSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = {
    User,
    ItemProduct,
    Order
  };