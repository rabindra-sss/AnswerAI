import mongoose from "mongoose";
import userModel from "../model/userModel.js";
import { createError } from "../error.js";

export const updateUser = async (req, res, next) => {

    try {
        if (req.params.id !== req.user.id) {
            return next(createError(401, 'user is not authenticated'));
        }

        const id = req.user.id;


        const updatedUser = await userModel.findByIdAndUpdate(req.params.id,
            { $set: req.body }, { new: true });

        const { password, ...others } = updatedUser._doc;

        res.send({
            success: true,
            message: 'user updated successfully',
            user: others
        })
    }
    catch (err) {
        next(createError(403, "you can update only your account"))
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        if (req.params.id !== req.user.id) {
            return next(createError(401, 'user is not authenticated'));
        }


        const id = req.user.id;


        await userModel.findByIdAndDelete(req.params.id);

        res.send({
            success: true,
            message: 'user deleted successfully',
        })
    }
    catch (err) {
        throw (err)
    }
}
export const getUser = async (req, res, next) => {

    try {
        //console.log('get user')
        
        const user = await userModel.findById(req.params.id);
        if (!user) return next(createError(401, "no user found"))
        const { password, ...others } = user._doc;

        res.status(200).send(others)
    }
    catch (err) {
        next(err)
    }
}