import express from 'express'
import { addCategory, deleteCategory, getCategories } from '../controllers/categoryController.js'
import { upload } from "../utils/multerConfig.js";

export const categoryRoutes = express.Router()

categoryRoutes.get('/', getCategories)
categoryRoutes.post('/add', upload.single('image'), addCategory)
categoryRoutes.delete('/delete/:id', deleteCategory)