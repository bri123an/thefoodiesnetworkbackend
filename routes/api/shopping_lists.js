const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Shopping_List = require('../../models/Shopping_List');
const User = require('../../models/User');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    POST api/shopping_lists
// @desc     Create a shopping list
// @access   Private
router.post(
  '/',
  auth,
  check('items', 'Items is required').not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newShoppingList = new Shopping_List({
        user: user.id,
        name: req.body.name,
        items: req.body.items
        
        
      });

      const shoppinglist = await newShoppingList.save();

      res.json(shoppinglist);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/shopping_lists/:id
// @desc     Update a shopping list
// @access   Private
router.put(
    '/:id',
    auth,
    check('items', 'Items is required').not().isEmpty(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
  
        const shoppinglist = await Shopping_List.findById(req.params.id);

        const update = ({
            name: req.body.name,
            items: req.body.items
        });
  
        const updatedShoppingList = await shoppinglist.updateOne(update);
  
        res.json(updatedShoppingList);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

// @route    GET api/shopping_lists
// @desc     Get all shopping lists
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const shopping_lists = await Shopping_List.find({user: req.user.id}).sort({ date: -1 });
    res.json(shopping_lists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/shopping_lists/:id
// @desc     Get shopping list by ID
// @access   Private
router.get('/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const shopping_list = await Shopping_List.findById(req.params.id);

    if (!shopping_list) {
      return res.status(404).json({ msg: 'Not found' });
    }

    res.json(shopping_list);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/shopping_lists/:id
// @desc     Delete a shopping list
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const shopping_list = await Shopping_List.findById(req.params.id);

    if (!shopping_list) {
      return res.status(404).json({ msg: 'Shopping List not found' });
    }

    // Check user
    if (shopping_list.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await shopping_list.remove();

    res.json({ msg: 'Shopping List removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

module.exports = router;
