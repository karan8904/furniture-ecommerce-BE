import express from 'express'
import { upload } from '../utils/multerConfig.js'
import { addProduct, deleteProduct, getProducts, updateProduct, getSingleProduct, getProductsFromCategory } from '../controllers/productController.js'

export const productRoutes = express.Router()

productRoutes.get('/', getProducts)
productRoutes.post('/add', upload.array('images', 5), addProduct)
productRoutes.delete('/delete/:id', deleteProduct)
productRoutes.put('/edit/:id', upload.array('images', 5), updateProduct)
productRoutes.get('/get/:id', getSingleProduct)
productRoutes.get('/category/:id', getProductsFromCategory)