const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');

// User registration
router.post(
 '/register',
[
     body('name', 'Name is required').notEmpty(),
       body('email', 'Please include a valid email').isEmail(),
     body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
   ],
async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }

     const { name, email, password } = req.body;

   try {
       let user = await User.findOne({ email });

       if (user) {
        return res.status(400).json({ msg: 'User already exists' });
       }
       const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
           name,
          email,
           password: hashedPassword,
       });

        await user.save();
      const payload = {
          user: {
               id: user.id,
             role: user.role
           },
       };
      jwt.sign(
       payload,
          process.env.JWT_SECRET,
         { expiresIn: '1h' },
        (err, token) => {
            if (err) throw err;
         res.json({ token });
         },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
);

// User login
router.post(
'/login',
 [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  async (req, res) => {
   const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }

    const { email, password } = req.body;

     try {
       const user = await User.findOne({ email });
       if (!user) {
       return res.status(400).json({ msg: 'Invalid Credentials' });
     }

      const isMatch = await bcrypt.compare(password, user.password);

       if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
     }
       const payload = {
         user: {
            id: user.id,
             role: user.role,
             name: user.name
         },
     };

       jwt.sign(
         payload,
          process.env.JWT_SECRET,
        { expiresIn: '1h' },
          (err, token) => {
             if (err) throw err;
          res.json({ token });
           },
       );
     } catch (err) {
       console.error(err.message);
      res.status(500).send('Server error');
    }
  },
);

router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check OTP validity
    if (user.otp !== parseInt(otp) || user.otpExpiry < new Date()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear OTP
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/user-count', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ userCount });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;