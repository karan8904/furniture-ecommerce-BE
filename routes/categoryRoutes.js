import express from 'express'
import { addCategory, deleteCategory, getCategories, getDummyCategories, updateCategory } from '../controllers/categoryController.js'
import { upload } from "../utils/multerConfig.js";

export const categoryRoutes = express.Router()

categoryRoutes.get('/', getCategories)
categoryRoutes.post('/add', upload.single('image'), addCategory)
categoryRoutes.delete('/delete/:id', deleteCategory)
categoryRoutes.put('/edit/:id', upload.single('image'), updateCategory)
categoryRoutes.get('/dummyCategories', getDummyCategories)