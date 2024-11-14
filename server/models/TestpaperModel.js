import mongoose from 'mongoose';

const testpaperSchema = new mongoose.Schema({
    
    
    classId:{
        type: String
    },
    testNumber:{
        type: String
    },
    testName: {
        type: Object
    }

})

export default mongoose.model('testpaper', testpaperSchema);