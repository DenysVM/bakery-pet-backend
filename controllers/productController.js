// controllers/productController.js

const Product = require('../models/Product');

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/products');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter
});

const getAllProducts = async (req, res) => {
  const { ids } = req.query;
  let query = {};

  if (ids) {
    const productIds = ids.split(',');
    query = { _id: { $in: productIds } };
  }

  try {
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    const newProduct = new Product(productData);
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: 'Error creating product', error });
  }
};

const createProductWithImage = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { category, name, description, price } = req.body;
      const imageUrl = req.file ? `/images/products/${req.file.filename}` : '';

      const newProduct = new Product({
        category,
        name: JSON.parse(name),
        description: JSON.parse(description),
        price,
        imageUrl
      });

      await newProduct.save();

      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(400).json({ message: 'Error creating product', error });
    }
  }
];

const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const productData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: 'Error updating product', error });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  createProductWithImage,
  updateProduct,
  deleteProduct,
};
