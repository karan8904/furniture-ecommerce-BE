import express from 'express'
import { addCategory, deleteCategory, getCategories, getDummyCategories, searchCategories, updateCategory } from '../controllers/categoryController.js'
import { upload } from "../utils/multerConfig.js";
import { adminAuth } from '../middlewares/adminAuthMiddleware.js';
import { userAuth } from '../middlewares/userAuthMiddleware.js'

export const categoryRoutes = express.Router()

categoryRoutes.get('/', getCategories)
categoryRoutes.post('/add', adminAuth, upload.single('image'), addCategory)
categoryRoutes.delete('/delete/:id', adminAuth, deleteCategory)
categoryRoutes.put('/edit/:id', adminAuth, upload.single('image'), updateCategory)
categoryRoutes.get('/dummyCategories', adminAuth, getDummyCategories)
categoryRoutes.get('/search/:query', userAuth, searchCategories)