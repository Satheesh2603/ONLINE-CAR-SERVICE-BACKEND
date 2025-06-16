const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPEKEY); // Ensure you have your Stripe secret key in .env file


const app = express();
connectDB();




// Middleware
app.use(bodyParser.json());
app.use(cors());
 // Define Routes
  app.use('/api/services', require('./routes/services'));
app.use('/api/spareparts', require('./routes/spareparts'));
app.use('/api/bookings', require('./routes/bookings'));
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/orders', require('./routes/orders'));
  app.use('/api/feedback', require('./routes/feedback'));


  app.post('/api/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'inr',
            payment_method_types: ['card'],
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});


// app.post('/api/create-payment-intent', async (req, res) => {
//     try {
//         const { amount, description, customerName, customerAddress  } = req.body; // Add description to the request body

//         const paymentIntent = await stripe.paymentIntents.create({
//             amount,
//             currency: 'inr',
//             payment_method_types: ['card'],
//             description,  // Add description here
//             shipping: {
//                 customerName: customerName,
//                 address: customerAddress, // Pass the full address
//             },
//         });

//         res.json({ clientSecret: paymentIntent.client_secret });
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// });




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));