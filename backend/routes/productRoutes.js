// routes/productRoutes.js
import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import Product from '../models/productModel.js';
import { isAuth, isAdmin } from '../utils.js';

// In ESM, __dirname is not available. process.cwd() is generally used for root-relative paths.
// Ensure categoryUploadPath is correctly resolved relative to your project root.
const categoryUploadPath = path.join(process.cwd(), 'uploads/categories');

// Create directory if it doesn't exist
if (!fs.existsSync(categoryUploadPath)) {
  fs.mkdirSync(categoryUploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, categoryUploadPath);
  },
  filename(req, file, cb) {
    const safeName = file.originalname
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_.-]/g, '');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage });

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

productRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      name: 'name' + Date.now(),
      slug: 'name' + Date.now(),
      image: '/images/p1.jpg',
      price: 0,
      salePrice: 0,
      requiresShippingInvoice: false,
      shippingCharge: 0,
      category: 'category',
      from: 'from',
      countInStock: 0,
      description: 'description',
      condition: 'condition',
      dimensions: 'dimensions',
      materials: 'materials',
      period: 'period',
      maker: 'maker',
      provenance: false,
      charishLink: '',
    });
    const product = await newProduct.save();
    res.send({ message: 'Product Created', product });
  })
);

productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = req.body.name || product.name;
      product.slug = req.body.slug || product.slug;
      product.image = req.body.image || product.image;
      product.images = req.body.images || product.images;
      product.price = req.body.price || product.price;
      product.salePrice = req.body.salePrice;
      product.requiresShippingInvoice =
        req.body.requiresShippingInvoice ?? product.requiresShippingInvoice;

      if (req.body.requiresShippingInvoice) {
        product.shippingCharge = 0;
      } else {
        product.shippingCharge =
          req.body.shippingCharge !== undefined
            ? Number(req.body.shippingCharge)
            : product.shippingCharge;
      }

      product.shippingCharge = req.body.shippingCharge;
      product.category = req.body.category || product.category;
      product.categoryImage = req.body.categoryImage || product.categoryImage;
      product.from = req.body.from || product.from;
      product.countInStock = req.body.countInStock || product.countInStock;
      product.description = req.body.description || product.description;
      product.condition = req.body.condition || product.condition;
      product.dimensions = req.body.dimensions || product.dimensions;
      product.materials = req.body.materials || product.materials;
      product.period = req.body.period || product.period;
      product.maker = req.body.maker || product.maker;
      product.provenance = req.body.provenance || product.provenance;
      product.charishLink = req.body.charishLink || product.charishLink;

      await product.save();
      res.send({ message: 'Product Updated' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const deleteImage = (img) => {
        // Ensure img is a string and handle potential leading slash for path.join
        const imagePath = path.join(
          process.cwd(),
          img.startsWith('/') ? img : '/' + img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        } else {
          console.warn(`Attempted to delete non-existent file: ${imagePath}`);
        }
      };

      if (product.image) deleteImage(product.image);
      if (product.images && product.images.length > 0)
        product.images.forEach(deleteImage);

      await product.remove();
      res.send({ message: 'Product Deleted' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

const PAGE_SIZE = 12;

productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { page = 1, pageSize = PAGE_SIZE } = req.query;

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      totalProducts: countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const {
      query,
      page = 1,
      pageSize = PAGE_SIZE,
      category,
      price,
      order,
    } = req.query;

    const filters = {
      ...(query &&
        query !== 'all' && { name: { $regex: query, $options: 'i' } }),
      ...(category &&
        category !== 'all' && {
          category: { $regex: `^${category}$`, $options: 'i' },
        }),
      ...(price &&
        price !== 'all' && {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }),
    };

    const sortOptions = {
      lowest: { price: 1 },
      highest: { price: -1 },
      newest: { createdAt: -1 },
      default: { _id: -1 },
    };

    const products = await Product.find(filters)
      .sort(sortOptions[order] || sortOptions.default)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments(filters);
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          categoryImage: { $first: '$categoryImage' },
        },
      },
    ]);
    res.send(categories);
  })
);

productRouter.put(
  '/category/:categoryName/image',
  isAuth,
  isAdmin,
  upload.single('image'),
  expressAsyncHandler(async (req, res) => {
    const { categoryName } = req.params;

    if (!req.file) {
      return res.status(400).send({ message: 'No image uploaded' });
    }

    const productsInCategory = await Product.find({ category: categoryName });

    if (productsInCategory.length > 0) {
      await Product.updateMany(
        { category: categoryName },
        { $set: { categoryImage: `/uploads/categories/${req.file.filename}` } }
      );

      res.send({
        message: 'Category Image Updated',
        image: `/uploads/categories/${req.file.filename}`,
      });
    } else {
      res.status(404).send({ message: 'No products found in this category' });
    }
  })
);

productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  product
    ? res.send(product)
    : res.status(404).send({ message: 'Product Not Found' });
});

productRouter.get('/sold', async (req, res) => {
  try {
    const soldProducts = await Product.find({ sold: true });
    res.json(soldProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sold products' });
  }
});

productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  product
    ? res.send(product)
    : res.status(404).send({ message: 'Product Not Found' });
});

export default productRouter;
