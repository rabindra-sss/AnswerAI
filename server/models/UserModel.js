import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
const UserSchema = new mongoose.Schema({
   
    userId:{
        type: String,
        required: [true,'userId is required'],
        unique: [true,'userId must be unique']
    },
    
    password:{
        type: String,
        // required: [true,'password is required']
    },
    
},{timestamps: true})

UserSchema.pre('save', async function(){
    if(this.password){
        const salt = await bcrypt.genSalt(10);
        this.password= await bcrypt.hash(this.password, salt)
    }
})
UserSchema.methods.comparepassword= async function(inputpassword){
    const ismatch= await bcrypt.compare(inputpassword,this.password);
    return ismatch;
}
export default mongoose.model('user', UserSchema);