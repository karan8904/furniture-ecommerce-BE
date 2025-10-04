import { faker } from "@faker-js/faker";
import Category from "../models/categorySchema.js";
import { dummyImages } from "./dummyCategories.js";

const allSizes = ["S", "M", "L", "XL"];
const allColors = ["#ff0000", "#000", "#6f6f6f", "#4f23ab"];

const furnitureNames = [
  "Modern Sofa", "Classic Armchair", "Wooden Dining Table", "Glass Coffee Table", "Queen Bed Frame",
  "Bookshelf", "TV Stand", "Recliner Chair", "Office Desk", "Bar Stool",
  "Nightstand", "Wardrobe", "Chest of Drawers", "Sectional Sofa", "Loveseat",
  "Ottoman", "Accent Chair", "Console Table", "Dining Chair", "Bench",
  "Side Table", "Futon", "Chaise Lounge", "Rocking Chair", "Bunk Bed",
  "Shoe Rack", "Corner Shelf", "Vanity Table", "Kitchen Island", "Patio Set"
];

const furnitureDescriptions = [
  "A stylish and comfortable addition to any living room.",
  "Crafted from premium materials for lasting durability.",
  "Perfect for modern and traditional interiors alike.",
  "Spacious design with ample storage options.",
  "Elegant finish and sturdy construction.",
  "Designed for both comfort and functionality.",
  "A centerpiece that elevates your home decor.",
  "Easy to assemble and maintain.",
  "Ideal for small and large spaces.",
  "Combines classic charm with modern convenience."
];

export const generateProducts = async () => {
  const categories = await Category.find();
  if (!categories.length) {
    throw new Error("No categories available");
  }
  const name = faker.helpers.arrayElement(furnitureNames);
  const description = faker.helpers.arrayElement(furnitureDescriptions) + " " + faker.lorem.sentence();
  const product = {
    name,
    category: faker.helpers.arrayElement(categories)._id,
    description,
    sizes: faker.helpers.arrayElements(allSizes, { min: 1, max: allSizes.length }),
    colors: faker.helpers.arrayElements(allColors, { min: 1, max: allColors.length }),
    price: Math.floor(faker.commerce.price({ min: 50, max: 500 })) * 100,
    discount_percent: faker.number.int({ min: 10, max: 80 }),
    stock: faker.number.int({ min: 20, max: 100 }),
    isVisible: true,
    images: faker.helpers.arrayElements(dummyImages, { min: 2, max: 5 })
  };
  return product;
};