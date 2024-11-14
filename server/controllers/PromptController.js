import BasePromptModel from "../models/BasePromptModel.js"
import UserPromptModel from "../models/UserPromptModel.js"

export const getBasePrompt = async(req, res)=>{
    try {
        const basePrompt = await BasePromptModel.findOne({name: "base"});
        res.json(basePrompt)
    } catch (error) {
        console.log(error)
    }
}
export const addBasePrompt = async(req, res)=>{
    try {
        const basePrompt = await BasePromptModel.create(req.body);
        res.json(basePrompt)
    } catch (error) {
        console.log(error)
    }
}
export const updateBasePrompt = async(req, res)=>{
    try {
        const {promptText} = req.body;
        const basePrompt = await BasePromptModel.findOneAndUpdate({name: "base"}, {promptText: promptText}, { new: true });
        res.json(basePrompt)
    } catch (error) {
        console.log(error)
    }
}
export const getUserPrompt = async(req, res)=>{
    try {
        const userId = req.user.id;
        console.log(userId)
        const userPrompt = await UserPromptModel.findOne({userId: "user"});
        res.json(userPrompt)
    } catch (error) {
        console.log(error)
    }
}
export const addUserPrompt = async(req, res)=>{
    try {
        const userPrompt = await UserPromptModel.create(req.body);
        res.json(userPrompt)
    } catch (error) {
        console.log(error)
    }
}
export const updateUserPrompt = async(req, res)=>{
    try {
        const {promptText} = req.body;
        const userPrompt = await UserPromptModel.findOneAndUpdate({userId: "user"}, {promptText: promptText}, { new: true });
        res.json(userPrompt)
    } catch (error) {
        console.log(error)
    }
}