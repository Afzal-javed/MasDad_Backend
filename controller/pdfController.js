import PDF from "../models/pdfModel.js";
export const pdfController = async (req, res) => {
    const { name, category, length, breadth, totalArea, pdf } = req.body;
    const pdfBuffer = Buffer.from(pdf, 'base64');
    try {
        if (!pdf) {
            res.status(404).send("Please select atleast one file");
        } else {
            const newPdf = new PDF({
                name,
                category,
                length,
                breadth,
                totalArea,
                pdf: pdfBuffer
            })
            await newPdf.save();
            return res.status(200).json(newPdf);
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error");
    }
}

export const allData = async (req, res) => {
    try {
        const pdf = await PDF.find({});
        const allDoc = pdf.map((doc) => {
            return { docId: doc?._id, DocName: doc.name, category: doc.category, length: doc.length, breadth: doc.breadth, totalArea: doc.totalArea, pdf: doc.pdf };
        });
        return res.status(200).json(allDoc);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}

export const docDelete = async (req, res) => {
    try {
        const docId = req.params.id
        const deleteDoc = await PDF.findByIdAndDelete({ _id: docId })
        res.status(200).json(deleteDoc);
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")
    }
}