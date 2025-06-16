const express = require('express');
const router = express.Router();
const SparePart = require('../models/SparePart');
const authMiddleware = require('../middleware/authMiddleware');


// GET all spare parts
router.get('/', async (req, res) => {
  try {
    const spareParts = await SparePart.find();
    res.json(spareParts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST a new spare part (Admin only)

router.post('/', authMiddleware, async (req, res) => {
    try {
    if(req.user.role !== 'admin'){
    return res.status(403).json({ msg: 'Unauthorized' })
    }
    const { name, description, price, stock, category, imageUrl } = req.body;
    const newSparePart = new SparePart({ name, description, price, stock, category, imageUrl });
    await newSparePart.save();
    res.status(201).json(newSparePart);
    } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
    }
    });

    // DELETE a spare part by ID (Admin only)
    router.put('/:id', authMiddleware, async (req, res) => {
      try {
        const updatedPart = await SparePart.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPart) return res.status(404).json({ msg: 'Spare part not found' });
        res.json(updatedPart);
      } catch (err) {
        res.status(500).json({ msg: 'Failed to update spare part' });
      }
    });
    
    // Delete spare part
    router.delete('/:id', authMiddleware, async (req, res) => {
      try {
        await SparePart.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Spare part deleted' });
      } catch (err) {
        res.status(500).json({ msg: 'Failed to delete spare part' });
      }
    });

    




    router.get('/product-count', async (req, res) => {
      try {
        const productCount = await SparePart.countDocuments();
        const outOfStockCount = await SparePart.countDocuments({ stock: 0 });
        res.json({ productCount, outOfStockCount });
      } catch (error) {
        console.error('Error fetching product count:', error);
        res.status(500).json({ msg: 'Server error' });
      }
    });



    // Example route to update stock
router.put('/update-stock/:sparePartId', async (req, res) => {
  const { sparePartId } = req.params;
  const { quantity } = req.body;

  try {
    const product = await SparePart.findById(sparePartId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increase stock by the cancelled quantity
    product.stock += quantity;
    await product.save();

    res.status(200).json({ message: 'Stock updated successfully' });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ message: 'Failed to update stock' });
  }
});



    // GET - Get all spare parts (with optional category filter)
// router.get('/get-category', async (req, res) => {
//   try {
//       const { category } = req.query; 

//       let query = {}; 
//       if (category) {
//           query = { category: category }; 
//       }

//       const spareParts = await SparePart.find(query);
//       res.status(200).json(spareParts);
//   } catch (err) {
//       console.error(err);
//       res.status(500).send('Server Error');
//   }
// });
    

router.get('/get-category', async (req, res) => {
  try {
      let { category } = req.query;

      let query = {};
      if (category) {
         
          query = { category: { $regex: new RegExp(`^${category}$`, 'i') } };
      }

      const spareParts = await SparePart.find(query);
      res.status(200).json(spareParts);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});


module.exports = router;