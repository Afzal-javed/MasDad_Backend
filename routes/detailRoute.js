import express from "express";
import { deleteItem, getAllDetals, packageDetail } from "../controller/detailController.js";

const router = express.Router();
router.post("/details", packageDetail);
router.get("/getAllData", getAllDetals);
router.delete("/delete/:id", deleteItem);
export default router;