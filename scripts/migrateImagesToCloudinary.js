import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Product from '../models/productSchema.js';
import Category from '../models/categorySchema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UPLOADS_DIR = path.join(__dirname, '../uploads');

// helper — upload a single local file to cloudinary
const uploadFile = async (localPath, folder) => {
  const result = await cloudinary.uploader.upload(localPath, {
    folder,
    transformation: [{ width: 800, crop: 'limit' }],
  });
  return result.secure_url;
};

// helper — pick n random items from an array without repeating
const pickRandom = (arr, n) => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
};

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  // get all image files from uploads folder
  const allFiles = fs.readdirSync(UPLOADS_DIR).filter(f =>
    ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(f).toLowerCase())
  );

  console.log(`\nFound ${allFiles.length} images in uploads folder`);

  if (allFiles.length < 10) {
    console.error('Need at least 10 images. Aborting.');
    await mongoose.disconnect();
    return;
  }

  // split — first 10 go to categories, rest go to products
  const categoryFiles = allFiles.slice(0, 10);
  const productFiles = allFiles.slice(10);

  // --- upload category images ---
  console.log('\n--- Uploading Category Images ---');
  const categoryUrls = [];

  for (const file of categoryFiles) {
    const localPath = path.join(UPLOADS_DIR, file);
    try {
      const url = await uploadFile(localPath, 'furniture-ecomm/categories');
      categoryUrls.push(url);
      console.log(`✓ ${file}`);
    } catch (err) {
      console.error(`✗ ${file} —`, err.message);
    }
  }

  // --- upload product images ---
  console.log('\n--- Uploading Product Images ---');
  const productUrls = [];

  for (const file of productFiles) {
    const localPath = path.join(UPLOADS_DIR, file);
    try {
      const url = await uploadFile(localPath, 'furniture-ecomm/products');
      productUrls.push(url);
      console.log(`✓ ${file}`);
    } catch (err) {
      console.error(`✗ ${file} —`, err.message);
    }
  }

  // --- assign category images ---
  console.log('\n--- Assigning Images to Categories ---');
  const categories = await Category.find({});
  console.log(`Found ${categories.length} categories`);

  // distribute categoryUrls across categories — one each, cycle if more categories than urls
  for (let i = 0; i < categories.length; i++) {
    try {
      categories[i].imageURL = categoryUrls[i % categoryUrls.length];
      await categories[i].save();
      console.log(`✓ Category "${categories[i].name}"`);
    } catch (err) {
      console.error(`✗ Category "${categories[i].name}" —`, err.message);
    }
  }

  // --- assign product images ---
  console.log('\n--- Assigning Images to Products ---');
  const products = await Product.find({});
  console.log(`Found ${products.length} products`);

  for (const product of products) {
    try {
      // pick 3-4 random urls from productUrls pool
      const count = Math.floor(Math.random() * 2) + 3; // 3 or 4
      product.images = pickRandom(productUrls, Math.min(count, productUrls.length));
      await product.save();
      console.log(`✓ Product "${product.name}" — ${product.images.length} image(s) assigned`);
    } catch (err) {
      console.error(`✗ Product "${product.name}" —`, err.message);
    }
  }

  console.log('\nMigration complete ✓');
  await mongoose.disconnect();
}

migrate();