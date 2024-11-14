import studentModel from "../models/StudentModel.js";

export const addStudent = async (req, res)=>{
    try {
        const student = await studentModel.create(req.body);
        res.json(student)
    } catch (error) {
        console.log(error)
    }
}

export const getStudent = async (req, res)=>{
    try {
        const id = req.params.id;
        const student = await studentModel.find({_id: id})
        res.json(student);
    } catch (error) {
        console.log(error)
    }
}

