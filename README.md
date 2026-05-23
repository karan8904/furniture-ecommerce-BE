# Furniture E-Commerce Backend

Backend API for a furniture e-commerce application built with Express, MongoDB, and Mongoose.

## Features

- User registration, login, profile updates, and admin user management
- JWT-based user and admin authentication middleware
- Product and category management with image upload support
- Cloudinary image storage for products, categories, and user avatars
- Cart, wishlist, address, review, and order APIs
- Stripe checkout and webhook handling
- Contact form, email preferences, invoice emails, and scheduled email utilities

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT
- Multer
- Cloudinary
- Stripe
- Nodemailer
- Node Cron

## Project Structure

```text
config/          Cloudinary configuration
controllers/     Request handlers and business logic
middlewares/     Auth and upload middleware
models/          Mongoose schemas
routes/          API route definitions
scripts/         Utility scripts, including image migration
utils/           Email, PDF, and cron helpers
index.js         App entry point
config.js        MongoDB connection
```

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root and add the required environment variables.

Start the development server:

```bash
npm run dev
```

By default, the app runs on `http://localhost:5000` unless `PORT` is provided.

## Environment Variables

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_KEY=your_jwt_secret

SERVICE=your_email_service
HOST=your_email_host
EMAIL=your_email_address
PASS=your_email_password
BASE_URL=http://localhost:5173

STRIPE_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Main API Routes

All routes are mounted from the root path.

| Base Route | Purpose |
| --- | --- |
| `/users` | Register, login, profile, user search, and admin user status |
| `/password` | Forgot password and reset password |
| `/categories` | Category listing, creation, update, delete, and search |
| `/products` | Product listing, creation, update, delete, search, filter, and category products |
| `/cart` | User cart operations |
| `/wishlist` | User wishlist operations |
| `/address` | User address CRUD |
| `/orders` | Order creation, confirmation, status updates, invoices, and admin order reports |
| `/payment` | Stripe checkout |
| `/stripe` | Stripe webhook endpoint |
| `/reviews` | Product reviews |
| `/contacts` | Contact form and admin contact management |
| `/email` | Email preferences |
| `/charges` | Delivery or service charge management |

## Image Uploads

Uploads are handled in memory with Multer and stored in Cloudinary. Supported image types are JPEG, PNG, and WebP, with a 5 MB file size limit.

The image migration helper is available at:

```bash
node scripts/migrateImagesToCloudinary.js
```

## Notes

- Auth-protected routes use either `userAuth` or `adminAuth`.
- The root route `/` returns a simple app health message.
- Scheduled email jobs are present in `utils/cronJobs.js` but are currently commented out in `index.js`.
