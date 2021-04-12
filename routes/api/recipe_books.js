const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Recipe_Book = require('../../models/Recipe_Book');
const User = require('../../models/User');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    POST api/recipe_books
// @desc     Create a recipe book
// @access   Private
router.post(
  '/',
  auth,
  check('recipes', 'Recipes is required').not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newRecipe_Book = new Recipe_Book({
        user: user.id,
        name: req.body.name,
        recipes: req.body.recipes
      });

      const recipe_book = await newRecipe_Book.save();

      res.json(recipe_book);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/recipe_books/:id
// @desc     Update a recipe book
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
  
        const recipe_book = await Recipe_Book.findById(req.params.id);

        const update = ({
            name: req.body.name,
            recipes: req.body.recipes
        });
  
        const updatedRecipe_Book = await recipe_book.updateOne(update);
  
        res.json(updatedRecipe_Book);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

// @route    GET api/recipe_books
// @desc     Get all recipe books
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const recipe_books = await Recipe_Book.find({user: req.user.id}).sort({ date: -1 });
    res.json(recipe_books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/recipe_books/:id
// @desc     Get recipe book by ID
// @access   Private
router.get('/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const recipe_book = await Recipe_Book.findById(req.params.id);

    if (!recipe_book) {
      return res.status(404).json({ msg: 'Not found' });
    }

    res.json(recipe_book);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/recipe_books/:id
// @desc     Delete a recipe book
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const recipe_book = await Recipe_Book.findById(req.params.id);

    if (!recipe_book) {
      return res.status(404).json({ msg: 'Recipe book not found' });
    }

    // Check user
    if (recipe_book.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await recipe_book.remove();

    res.json({ msg: 'Recipe book removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

module.exports = router;
