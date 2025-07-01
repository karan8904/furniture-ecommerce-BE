import Category from "../models/categorySchema.js";
import fs from "fs";
import { categoriesList, dummyImages } from "../utils/dummyCategories.js";
import { faker } from "@faker-js/faker";

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
        res.status(400).json({ message: "Cannot fetch categories. Refresh the page..." })
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

export const updateCategory = async(req, res) => {
    try {
        const id = req.params.id
        const { name, description, image } = req.body

        const newData = {
            name: name,
            description: description
        }

        if(req.file)
            newData.imageURL = req.file.path
        else if(image)
            newData.imageURL = image
        else
            return res.status(400).json({message: "Cannot update. Try again."})

        await Category.findByIdAndUpdate(id, newData)
        res.status(200).json({ message: "Category Updated Successfully." })

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Cannot update the category. Try again..." })
    }
}

export const getDummyCategories = async(req, res) => {
    try {
        const categories = categoriesList.map((name) => ({
            name: name,
            description: faker.lorem.sentences(),
            imageURL: faker.helpers.arrayElement(dummyImages)
          }));        
        // await Category.insertMany(categories)
        res.status(200).json(categories)

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Cannot get products" })
    }
}

export const searchCategories = async(req, res) => {
    try {
        const query = req.params.query;
        const categories = await Category.find({
          name: { $regex: `^${query}`, $options: "i" },
        });
        res.status(200).json(categories);
      } catch (error) {
        res.status(500).json({ message: "Category not found." });
      }
}