import Category from "../models/categorySchema.js";
import fs from "fs";

export const addCategory = async(req, res) => {
    try {
        const { name, description } = req.body
        const { path } = req.file
        const isCatagoryExists = await Category.findOne({name: { $regex: `^${name}$`, $options: "i" }})
        if(isCatagoryExists){
            fs.unlinkSync(path);
            return res.status(400).json({ message: "Category already exists." })
        }
        const category = new Category({name, description, imageURL: path})
        await category.save()
        res.status(201).json({ message: "Category added.", category})
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Cannot add the category. Try again..." })
    }
}

export const getCategories = async(req, res) => {
    try {
        const categories = await Category.find()
        res.status(200).json({ categories })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Cannot add the category. Try again..." })
    }
}

export const deleteCategory = async(req, res) => {
    try {
        const id = req.params.id
        const category = await Category.findByIdAndDelete(id)
        fs.unlinkSync(category.imageURL)
        res.status(200).json({message: "Category deleted successfully."})
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Cannot delete the category. Try again..." })
    }
}