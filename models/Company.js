const mongoose = require('mongoose');
const { Schema } = mongoose;

const CompanySchema = new Schema({
    
    name: { type: String, required: true },
    position_role: { type: String, required: true }, 
    description: { type: String },
    
    
    salary: { type: Number, required: true }, 

    
    constraints: {
        
        min_year: { type: Number, default: 4 }, 
        
        
        min_cgpa: { type: Number, default: 6.0 },
        
        
        history_of_arrears_allowed: { type: Boolean, default: true },
        
        
        max_standing_arrears: { type: Number, default: 0 }
    },

    
    
    applicants: [{
        student: { type: Schema.Types.ObjectId, ref: 'Student' },
        applied_at: { type: Date, default: Date.now }
    }],

    created_at: { type: Date, default: Date.now }
});


CompanySchema.index({ salary: 1 });

module.exports = mongoose.model('Company', CompanySchema);