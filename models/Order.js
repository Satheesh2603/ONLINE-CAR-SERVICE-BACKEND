 const mongoose = require('mongoose');

// const OrderSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     items: [
//         {
//             sparePartId: { type: mongoose.Schema.Types.ObjectId, ref: 'SparePart', required: true },
//             quantity: { type: Number, required: true },
//         }
//     ],
//     total: { type: Number, required: true },
//     status: { type: String, enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered'], default: 'Pending' },
//     createdAt: { type: Date, default: Date.now }
// });

// const Order = mongoose.model('Order', OrderSchema);
// module.exports = Order;


const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            sparePartId: { type: mongoose.Schema.Types.ObjectId, ref: 'SparePart', required: true },
            quantity: { type: Number, required: true },
        }
    ],
    total: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true }
    },
    
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);


module.exports = Order;

