import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    
    name:{
        type: String
    },
    email:{
        type: String,
        unique: true
    }
})

export default mongoose.model('student', studentSchema);