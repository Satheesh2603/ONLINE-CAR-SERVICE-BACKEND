const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const authMiddleware = require('../middleware/authMiddleware');


// GET all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});
// POST a new service (Admin only)

router.post('/', authMiddleware, async (req, res) => {
    try {
    if(req.user.role !== 'admin'){
    return res.status(403).json({ msg: 'Unauthorized' })
    }
    const { name, description, price } = req.body;
    const newService = new Service({ name, description, price });
    await newService.save();
    res.status(201).json(newService);
    } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
    }
    });
    module.exports = router;

  