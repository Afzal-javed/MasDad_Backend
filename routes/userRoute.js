import express from "express"
import { confirmPassword, generateOTP, login, logout, register, verifyOtp } from "../controller/userController.js";
const router = express.Router();
router.post("/register", register)
router.post("/login", login)
router.post("/logout/:id", logout)
router.post("/otp", generateOTP);
router.post("/verify-otp", verifyOtp);
router.post("/confirm-password", confirmPassword);
export default router;