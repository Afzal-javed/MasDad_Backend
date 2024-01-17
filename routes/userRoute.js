import express from "express"
import { login, logout, register } from "../controller/userController.js";
const router = express.Router();
router.post("/register", register)
router.post("/login", login)
router.post("/logout/:id", logout)
export default router;