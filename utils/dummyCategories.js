import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

export const categoriesList = [
  "Dining",
  "Bed",
  "Storage",
  "Outdoors",
  "Sofas",
  "Chairs",
  "Desks",
  "Tables",
  "Cupboard",
  "Drawers",
];

function getAllFilesFromUploads() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const uploadsDir = path.join(__dirname, "../uploads");

  if (!fs.existsSync(uploadsDir)) return [];

  const files = fs.readdirSync(uploadsDir);
  return files.map((file) => path.join("uploads", file));
}

export const dummyImages = getAllFilesFromUploads();