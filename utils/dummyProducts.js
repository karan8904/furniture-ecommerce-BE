import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { faker } from "@faker-js/faker";
import Category from "../models/categorySchema.js";
import { dummyImages } from "./dummyCategories.js";

const allSizes = ["S", "M", "L", "XL"];
const allColors = ["#ff0000", "#000", "#6f6f6f", "#4f23ab"];

export const generateProducts = async() => {

    const categories = await Category.find()
    if (!categories.length) {
        return res.status(500).json({ error: "No categories available" });
      }

    const product = {
        name: faker.commerce.productName(),
        category: faker.helpers.arrayElement(categories)._id,
        description: faker.lorem.sentences(3),
        sizes: faker.helpers.arrayElements(allSizes, {min: 1, max: allSizes.length}),
        colors: faker.helpers.arrayElements(allColors, {min: 1, max: allColors.length}),
        price: Math.floor(faker.commerce.price({ min: 50, max: 500 })) * 100,
        discount_percent: faker.number.int({ min: 10, max: 80 }),
        stock: faker.number.int({ min: 20, max: 100 }),
        isVisible: true,
        images: faker.helpers.arrayElements(dummyImages, {min: 2, max: 5})
    };
    return product
}
