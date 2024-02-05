import mongoose from "mongoose";

const listItemScheema = new mongoose.Schema({
    subTitle: String,
    subList: String
})

const detailSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    planPackage: {
        type: String,
        required: true
    },
    list: [listItemScheema]
})
const DetailModel = mongoose.model('Details', detailSchema)
export default DetailModel