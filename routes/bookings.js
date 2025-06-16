const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/authMiddleware');

// POST a new booking
// router.post('/', authMiddleware, async (req, res) => {
//     try {
//     const { serviceId, bookingDate } = req.body;

//     console.log(serviceId)

//      const newBooking = new Booking({
//         userId: req.user.id,
//        serviceId,
//        bookingDate
//       });
//      await newBooking.save();
//    res.status(201).json(newBooking);
//      } catch (err) {
//       console.error(err);
//       res.status(500).send('Server Error');
//     }
//   });

// POST a new booking
router.post('/', authMiddleware, async (req, res) => {
    try {
    // const { serviceId, bookingDate } = req.body;
    const { serviceId, bookingDate, carBrand, carModel } = req.body;
     const newBooking = new Booking({
        userId: req.user.id,
       serviceId,
       bookingDate,
       carBrand,
       carModel
      });
     await newBooking.save();
   res.status(201).json(newBooking);
     } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });



   // GET all bookings (Admin only)
 router.get('/', authMiddleware, async (req, res) => {
  try {
    //  if(req.user.role !== 'admin'){
    //      return res.status(403).json({ msg: 'Unauthorized' })
    //   }
     const bookings = await Booking.find().populate('userId').populate('serviceId');
      res.json(bookings);
    } catch (err) {
      res.status(500).send('Server Error');
   }
 });

 // GET bookings by user ID
router.get('/user', authMiddleware,  async (req, res) => {
   try {
       const bookings = await Booking.find({ userId: req.user.id }).populate('serviceId');
      res.json(bookings);
  } catch (err) {
      console.error(err);
    res.status(500).send('Server Error');
  }
});
 // PUT to update booking status by id
router.put('/:id', authMiddleware, async (req, res) => {
 try{
     if(req.user.role !== 'admin'){
      return res.status(403).json({ msg: 'Unauthorized' })
    }
     const { status } = req.body;
      const booking = await Booking.findByIdAndUpdate(req.params.id, {status}, {new: true});
     if(!booking){
         return res.status(404).json({msg: 'Booking not found'})
     }
   res.json(booking);

  } catch (error){
    console.error(error);
    res.status(500).send('Server Error');
  }
});
module.exports = router;