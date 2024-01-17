import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();
const URL = process.env.MONGO_URL

mongoose.connect(URL).then(() => console.log("Connected to DataBase")).catch((err) => console.log("Error", err))

