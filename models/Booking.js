const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', required: true 
    },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    bookingDate: { type: Date, required: true },
    carBrand: {  
      type: String,
      required: true 
    },
    carModel: {  
      type: String,
      required: true 
    },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Completed'], default: 'Pending' }
  });
   module.exports = mongoose.model('Booking', BookingSchema);