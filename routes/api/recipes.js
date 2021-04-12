const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Recipe = require('../../models/Recipe');
const User = require('../../models/User');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    POST api/recipes
// @desc     Create a recipe
// @access   Private
router.post(
  '/',
  auth,
  check('ingredients', 'Ingredients is required').not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newRecipe = new Recipe({
        user: user.id,
        name: req.body.name,
        ingredients: req.body.ingredients,
        directions: req.body.directions
        
        
      });

      const recipe = await newRecipe.save();

      res.json(recipe);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/recipes/:id
// @desc     Update a recipe
// @access   Private
router.put(
    '/:id',
    auth,
    check('ingredients', 'Ingredients is required').not().isEmpty(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
  
        const recipe = await Recipe.findById(req.params.id);

        const update = ({
            name: req.body.name,
            ingredients: req.body.ingredients,
            directions: req.body.directions
        });
  
        const updatedRecipe = await recipe.updateOne(update);
  
        res.json(updatedRecipe);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

// @route    GET api/recipes
// @desc     Get all recipes
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({user: req.user.id}).sort({ date: -1 });
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/recipes/:id
// @desc     Get recipe by ID
// @access   Private
router.get('/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ msg: 'Not found' });
    }

    res.json(recipe);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/recipes/:id
// @desc     Delete a recipe
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    // Check user
    if (recipe.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await recipe.remove();

    res.json({ msg: 'Recipe removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

module.exports = router;
