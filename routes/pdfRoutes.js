import express from "express";
import { allData, docDelete, pdfController } from "../controller/pdfController.js";
const router = express.Router();

router.post("/upload", pdfController);
router.get("/data", allData)
router.delete("/delete/:id", docDelete);
export default router;