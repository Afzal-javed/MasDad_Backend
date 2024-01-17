import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    length: {
        type: String,
        required: true
    },
    breadth: {
        type: String,
        required: true
    },
    totalArea: {
        type: String,
        required: true
    },
    pdf: {
        type: Buffer,
        required: true
    }
}, { timestamps: true })

const PDF = mongoose.model("PDF", pdfSchema);
export default PDF;