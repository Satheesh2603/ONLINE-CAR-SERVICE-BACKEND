const nodemailer = require('nodemailer');
const User = require('../models/User')

// Configure Nodemailer transport with Gmail (You can replace this with any other SMTP service)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Using Gmail as an SMTP service
    auth: {
        user: process.env.EMAIL_USER, // Replace with your email address
        pass: process.env.EMAIL_PASS, // Replace with your email password
    },
});

 const user = await User.findById(req.user.id);  
      console.log(user.email)

const sendOrderConfirmationEmail = (userEmail, order) => {   


    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender's email address
        to: user.email, // Recipient's email address
        subject: `Order Confirmation - ${order._id}`, // Subject of the email
        text: `
            Hello ${order.userId},\n\n
            Thank you for your order! Your order ID is ${order._id}. Here are your order details:\n\n
            Items:\n
            ${order.items.map(item => `- ${item.name} (x${item.quantity})`).join('\n')}
            \n\n
            Shipping Address:\n
            ${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.zip}, ${order.address.country}
            \n\n
            Total: ₹${order.total}\n\n
            We will notify you once your order is shipped.\n\n
            Thank you for shopping with us!
        `, // The body of the email
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};


module.exports = { sendOrderConfirmationEmail };