// // index.js
// import express from 'express';
// import cors from 'cors';
// import { PrismaClient } from '@prisma/client';
// import multer from 'multer';
// import path from 'path';
// import bcrypt from 'bcryptjs';
// const prisma = new PrismaClient();
// app.use(express.json());
// app.use(cors());
// // Serve static files from the "uploads" folder
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// // Set storage options for images
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Directory to store uploaded files
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to file name to avoid conflicts
//   },
// });
// // Initialize multer for file uploads
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // Max file size 10MB
//   fileFilter: (req, file, cb) => {
//     const fileTypes = /jpeg|jpg|png|gif/;
//     const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = fileTypes.test(file.mimetype);
//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Invalid file type, only images are allowed!'), false);
//     }
//   },
// });
// // CRUD for Product
// app.post('/api/products', upload.single('image'), async (req, res) => {
//   try {
//     const { name, price, description, categoryId } = req.body;
//     // Ensure price and categoryId are parsed to correct types
//     const parsedPrice = parseFloat(price); // Convert price to a float
//     const parsedCategoryId = parseInt(categoryId, 10); // Convert categoryId to an integer (with base 10)
//     // Log the parsed data to verify
//     console.log('Received Product Data:', { name, parsedPrice, description, parsedCategoryId });
//     // Validate parsed data to ensure correct types
//     if (isNaN(parsedPrice) || isNaN(parsedCategoryId)) {
//       return res.status(400).json({ error: 'Invalid data types for price or categoryId' });
//     }
//     // Validate if all necessary fields are present
//     if (!name || !description || !categoryId) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }
//     // Check if file was uploaded
//     const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
//     // Create the product in the database
//     const product = await prisma.product.create({
//       data: {
//         name: name,
//         price: parsedPrice,
//         description: description || '', // Ensure description is an empty string if not provided
//         imageUrl: imageUrl,
//         categoryId: parsedCategoryId,
//       },
//     });
//     res.status(201).json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// });

// app.post('/api/register', async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//       },
//     });

//     res.status(201).json({
//       id: newUser.id,
//       name: newUser.name,
//       email: newUser.email,
//     });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // ✅ Login Route
// app.post('/api/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

//     res.json({
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.get('/api/products', async (req, res) => {
//   try {
//     // Fetch all products from the database
//     const products = await prisma.product.findMany();
//     // Log the products to debug
//     console.log('Fetched Products:', products);
//     res.status(200).json(products);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// });
// app.delete('/api/products/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await prisma.product.delete({
//       where: { id: parseInt(id, 10) }, // Delete product by id
//     });
//     res.status(200).json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// });
// // CRUD for Category
// app.post('/api/categories', async (req, res) => {
//   try {
//     const { name } = req.body;
//     const category = await prisma.category.create({
//       data: { name },
//     });
//     res.status(201).json(category);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// });
// app.get('/api/categories', async (req, res) => {
//   try {
//     const categories = await prisma.category.findMany();
//     res.status(200).json(categories);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// });
// app.delete('/api/categories/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const category = await prisma.category.delete({
//       where: { id: parseInt(id, 10) },
//     });
//     res.status(200).json(category);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// });
// app.get('/', (req, res) => {
//   res.send(`
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Server Status</title>
//       <style>
//         body {
//           background-color: #f0f4f8;
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           height: 100vh;
//           margin: 0;
//         }
//         .container {
//           text-align: center;
//         }
//         h1 {
//           color: #007bff;
//           font-size: 3rem;
//           margin-bottom: 1rem;
//         }
//         p {
//           color: #555;
//           font-size: 1.2rem;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <h1>🚀 Server is Running</h1>
//         <p>Welcome to the backend server.</p>
//       </div>
//     </body>
//     </html>
//   `);
// });
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs'); // ✅ Proper CommonJS import

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- Routes ---

// Register
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });
    res.status(201).json(user);
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid password' });

    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Add category
app.post('/api/categories', async (req, res) => {
  const { name } = req.body;
  try {
    const category = await prisma.category.create({ data: { name } });
    res.status(201).json(category);
  } catch (err) {
    console.error("Category creation error:", err);
    res.status(500).json({ error: 'Could not create category' });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    console.error("Fetch categories error:", err);
    res.status(500).json({ error: 'Could not fetch categories' });
  }
});

// Add product with image upload
app.post('/api/products', upload.single('image'), async (req, res) => {
  const { name, price, description, categoryId } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        image: imageUrl,
        categoryId: parseInt(categoryId),
      }
    });
    res.status(201).json(product);
  } catch (err) {
    console.error("Product creation error:", err);
    res.status(500).json({ error: 'Could not create product' });
  }
});
app.get('/api/products', async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await prisma.product.findMany();
    // Log the products to debug
    console.log('Fetched Products:', products);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.delete({
      where: { id: parseInt(id, 10) }, // Delete product by id
    });
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
