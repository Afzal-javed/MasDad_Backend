import DetailModel from "../models/packageModel.js";


export const packageDetail = async (req, res) => {
    try {
        const { title, planPackage, list } = req.body;
        const newDetail = new DetailModel({
            title,
            planPackage,
            list
        })
        await newDetail.save();
        res.status(200).send("Detail Uploaded");
    } catch (error) {
        res.status(500).send("Internal server error");
    }
}

export const getAllDetals = async (req, res) => {
    try {
        const allDetail = await DetailModel.find({});
        const allData = allDetail.map((data) => {
            return { id: data._id, title: data.title, planPackage: data.planPackage, list: data.list }
        })
        res.status(200).json(allData);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const itemNotExist = await DetailModel.findById(id);
        if (!itemNotExist) {
            res.status(404).send("Deleted Item Not Found")
        } else {
            await DetailModel.findByIdAndDelete(id)
            res.status(200).send("Item Deleted Successfully");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}