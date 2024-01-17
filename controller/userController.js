import Users from "../models/userModel.js"
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
export const register = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        const isUserAlreadyExist = await Users.findOne({ email });
        if (isUserAlreadyExist) {
            res.status(401).send("User Already Exist")
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            const newUser = new Users({
                fullName,
                email,
                password: hashedPassword
            })
            await newUser.save();
            res.status(200).send("User register successfully");
        }
    } catch (error) {
        res.status(500).send("Internal server error")
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Users.findOne({ email })
        if (!user) {
            res.status(404).send("User does not exists")
        } else {
            const validateUser = await bcrypt.compare(password, user.password)
            if (!validateUser) {
                res.status(400).send("Invalid credentials")
            } else {
                const payload = {
                    userId: user._id,
                    email: user.email
                }
                const JWT = process.env.JWT_KEY
                jwt.sign(payload, JWT, { expiresIn: 84600 }, async (err, token) => {
                    await Users.updateOne({ _id: user._id }, {
                        $set: { token }
                    })
                    await user.save();
                    return res.status(200).json({ user: { id: user?._id, email: user?.email, fullName: user?.fullName }, token: token })
                })
            }
        }
    } catch (error) {
        res.status(500).send("Internal server error")
    }
}
export const logout = async (req, res) => {
    const id = req.params.userId;
    try {
        const user = await Users.findOne(id)
        if (!user) {
            res.status(404).send("User does not exist")
        } else {
            user.token = ''
            user.save();
            res.status(200).send("User Logout successfully")
        }
    } catch (error) {
        res.status(500).send("Internal server error");
    }
}