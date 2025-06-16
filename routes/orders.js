const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const SparePart = require('../models/SparePart');
const auth = require('../middleware/authMiddleware');
//const { sendOrderConfirmationEmail } = require('../config/mailer');

const nodemailer = require('nodemailer');
const User = require('../models/User')

// ✅ Place an order

// router.post('/', auth, async (req, res) => {
//     try {
//         const { items, total, address } = req.body;

//         // Check if the items array is empty
//         if (!items || items.length === 0) {
//             return res.status(400).json({ msg: 'No items in order' });
//         }

//         // Check if the address is complete
//         if (!address || !address.street || !address.city || !address.state || !address.zip || !address.country) {
//             return res.status(400).json({ msg: 'Address is incomplete' });
//         }

//         // Check if there's enough stock for each item
//         for (const item of items) {
//             const sparePart = await SparePart.findById(item.sparePartId);

//             // If spare part doesn't exist, return an error
//             if (!sparePart) {
//                 return res.status(404).json({ msg: `Spare part with id ${item.sparePartId} not found` });
//             }

//             // If stock is insufficient, return an error
//             if (sparePart.stock < item.quantity) {
//                 return res.status(400).json({ msg: `Insufficient stock for ${sparePart.name}` });
//             }
//         }

//         // Create a new order
//         const order = new Order({
//             userId: req.user.id,
//             items,
//             total,
//             address,            
//         });

//         // Decrease the stock for each item after the order is created
//         for (const item of items) {
//             const sparePart = await SparePart.findById(item.sparePartId);

//             // Decrease the stock
//             sparePart.stock -= item.quantity;
//             await sparePart.save();
//         }

//         // Save the order to the database
//         await order.save();

//         res.status(201).json({ msg: 'Order placed successfully', order });
//     } catch (error) {
//         res.status(500).json({ msg: 'Server error', error: error.message });
//     }
// });




router.post('/', auth, async (req, res) => {
    try {
        const { items, total, address } = req.body;

        // Check if the items array is empty
        if (!items || items.length === 0) {
            return res.status(400).json({ msg: 'No items in order' });
        }

        // Check if the address is complete
        if (!address || !address.street || !address.city || !address.state || !address.zip || !address.country) {
            return res.status(400).json({ msg: 'Address is incomplete' });
        }

        // Check if there's enough stock for each item
        for (const item of items) {
            const sparePart = await SparePart.findById(item.sparePartId);

            // If spare part doesn't exist, return an error
            if (!sparePart) {
                return res.status(404).json({ msg: `Spare part with id ${item.sparePartId} not found` });
            }

            // If stock is insufficient, return an error
            if (sparePart.stock < item.quantity) {
                return res.status(400).json({ msg: `Insufficient stock for ${sparePart.name}` });
            }
        }

        // Create a new order
        const order = new Order({
            userId: req.user.id,
            items,
            total,
            address,
        });

        // Decrease the stock for each item after the order is created
        for (const item of items) {
            const sparePart = await SparePart.findById(item.sparePartId);

            // Decrease the stock
            sparePart.stock -= item.quantity;
            await sparePart.save();
        }

        // Save the order to the database
        await order.save();


        const user = await User.findById(req.user.id);


        // **Send Email Confirmation**

        // 1.  Configure Nodemailer (replace with your actual credentials)
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS
          },
          secure: false,
          tls: {
            rejectUnauthorized: false,
          },
          connectionTimeout: 10000,
        });

        // 2. Create the email message
        const mailOptions = {
            from: process.env.SMTP_USER, 
            to: user.email, 
            subject: 'Order Confirmation',
            html: `
              <h1>Thank you for your order!</h1>
              <p>Your order has been placed successfully and is being processed.</p>
              <p>Order ID: ${order._id}</p>
              <p>Total: $${order.total}</p>
              <p>Shipping Address:</p>
              <p>${order.address.street}, ${order.address.city}, ${order.address.state} ${order.address.zip}, ${order.address.country}</p>
              <p>Items:</p>
              <ul>
                ${order.items.map(item => `<li>Spare Part ID: ${item.sparePartId}, Quantity: ${item.quantity}</li>`).join('')}
              </ul>
              <p>We will notify you when your order has shipped.</p>
              <p>Thanks!</p>
            `, 
        };

        // 3. Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);                
            } else {
                console.log('Email sent:', info.response);
            }
        });


        res.status(201).json({ msg: 'Order placed successfully', order });
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});


// router.get('/orders/user/:userId', async (req, res) => {
//     try {
//       const orders = await Order.find({ userId: req.params.userId }); 
//       res.json(orders);
//     } catch (error) {
//         console.log(error)
//       res.status(500).json({ message: 'Error fetching orders' });
//     }
//   });


router.get('/user/:userId', async (req, res) => {
    try {
      // Find orders by the user's ID
      const orders = await Order.find({ userId: req.params.userId });
  
      // Check if any orders were found
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'No orders found for this user' });
      }
  
      // Return the found orders
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error fetching orders' });
    }
  });
  
  


// ✅ Get all orders
router.get('/get-all-order', async (req, res) => {
    try {
        const orders = await Order.find().populate('items.sparePartId');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied' });
        }
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        order.status = req.body.status;
        await order.save();
        res.json({ msg: 'Order status updated', order });
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Server error' });
    }
});


router.get('/order-count', async (req, res) => {
    try {
      const orderCount = await Order.countDocuments();
      res.json({ orderCount });
    } catch (error) {
      console.error('Error fetching order count:', error);
      res.status(500).json({ msg: 'Server error' });
    }
  });



  // Express route for order cancellation
router.put('/cancel/:orderId', async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Find the order by ID
      const order = await Order.findById(orderId).populate('items.sparePartId');
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Update stock for each item in the order
      for (let item of order.items) {
        const product = item.sparePartId;
        product.stock += item.quantity;  // Increase the stock by the quantity ordered
        await product.save();
      }
  
      // Update order status to 'Cancelled'
      order.status = 'Cancelled';
      await order.save();
  
      return res.status(200).json({ message: 'Order cancelled and stock updated', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to cancel order' });
    }
  });
  

module.exports = router;
