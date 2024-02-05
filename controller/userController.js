import Users from "../models/userModel.js"
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import OTP from "../models/otpModel.js";
import nodemailer from "nodemailer";

dotenv.config();


export const register = async (req, res) => {
    const { fullName, email, password, uid } = req.body
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
                password: hashedPassword,
                uid
            })
            await newUser.save();
            res.status(200).send("User register successfully");
            sendGreetingEmail(email, fullName);
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
    const id = req.params.id;
    try {
        const user = await Users.findById(id);
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

export const generateOTP = async (req, res) => {
    const { email } = req.body;
    try {
        const userNotExist = await Users.findOne({ email });
        if (!userNotExist) {
            res.status(404).send("User Does Not Exist");
        } else {
            let otp = Math.floor((Math.random() * 1000000) + 1)
            let otpData = new OTP({
                email: email,
                otpCode: otp,
                expireIn: new Date().getTime() + 120 * 1000
            })
            await otpData.save();
            res.status(200).send("OTP sent successfully to your email");
            sendOTPEmail(email, otp);
        }
    } catch (error) {
        res.status(500).send("Internal server error")
    }
}
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const data = await OTP.findOne({ email: email, otpCode: otp })
        if (!data) {
            res.status(400).send("Enter the valid OTP");
        } else {
            let currTime = new Date().getTime();
            let diff = data.expireIn - currTime;
            if (diff >= 0) {
                res.status(200).send("OTP has been verified")
            } else {
                res.status(400).send("OTP has been expire")
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
}

export const confirmPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await Users.findOne({ email });
        if (!user) {
            res.status(404).send("User Not Register")
        } else {
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = bcrypt.hashSync(newPassword, salt);
            user.password = hashedPassword;
            await user.save();
            res.status(200).send("Password updated successfully You can login Now");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
}

const sendGreetingEmail = async (email, name) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            },
        })
        const GreetingMail = {
            from: process.env.EMAIL,
            to: email,
            subject: `Welcome to MAS-DAD`,
            text: `Dear ${name},
            Thank you for registering with MAS-DAD. We are excited to have you on board!.`
        }
        const result = await transporter.sendMail(GreetingMail);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

const sendOTPEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP for Verification',
            text: `Your OTP is ${otp}. Please use it to verify your account.`,
        };
        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
// export const logout = async (req, res) => {
//     const id = req.params.userId;

//     try {
//         const user = await Users.findOne({ _id: ObjectId(id) });
//         console.log(user);

//         if (!user) {
//             res.status(404).send("User does not exist");
//         } else {
//             user.token = '';
//             await user.save();
//             res.status(200).send("User Logout successfully");
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal server error");
//     }
// }
