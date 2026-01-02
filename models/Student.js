const mongoose = require('mongoose');
const { Schema } = mongoose;

const StudentSchema = new Schema({
    
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    basic_info: {
        name: { type: String, required: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        mothers_name: { type: String },
        fathers_name:{type:String},
        current_year: { 
            type: Number, 
            min: 1, 
            max: 4, 
            required: true 
        },
        
        resume_link: { type: String } 
    },

    
    academic_info: {
        
        
        grades: [{
            subject_name: { type: String, required: true },
            category: { 
                type: String, 
                enum: ['CAT', 'Semester', 'Lab'] 
            },
            marks_or_grade: { type: String, required: true } 
        }],
        
        current_cgpa: { type: Number, default: 0.0 },

        
        arrear_info: {
            history_of_arrears: { type: Boolean, default: false }, 
            standing_arrears: { type: Number, default: 0 } 
        }
    },

    
    placement_info: {
        is_placed: { type: Boolean, default: false },
        placed_company: { type: String, default: null },
        current_package: { type: Number, default: 0 } 
    }
});

module.exports = mongoose.model('Student', StudentSchema);