const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const User = require('../models/User');
const Company= require('../models/Company');
const { requireAuth } = require('../middleware/authMiddleware');


router.post('/basic-info', requireAuth, async (req, res) => {
    try {
        const { name, gender, fathers_name,mothers_name, current_year, resume_link } = req.body;
        const userId = req.session.userId;

        
        const existingProfile = await Student.findOne({ user: userId });
        if (existingProfile) {
            return res.status(400).json({ message: "Profile already exists. Use update instead." });
        }

        
        const newStudent = new Student({
            user: userId, 
            basic_info: {
                name,
                gender,
                fathers_name,
                mothers_name,
                current_year,
                resume_link
            },
            
            academic_info: { grades: [] },
            placement_info: { is_placed: false }
        });

        const savedStudent = await newStudent.save();

        //update student in Users table to point to updated profile
        await User.findByIdAndUpdate(userId, {
            student_profile: savedStudent._id
        });

        res.status(201).json({ message: "Basic Info Saved", studentId: savedStudent._id });

    } catch (err) {
        console.error("Basic Info Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get('/student_dashboard',requireAuth, async (req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","student_dashboard.html"));
});
router.get('/company_list',requireAuth,async(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","company_list.html"));
});

router.get('/profile',requireAuth,async (req,res)=>{
    try{
        const student= await Student.findOne({user: req.session.userId}).populate('user','email');
        if(!student) return res.status(404).json({message:'Profile not found'});
        res.json(student);
    } catch(err){
        res.status(500).json({message:'Server Error'});
    }
});

router.get('/companies', requireAuth, async (req, res)=>{
    try{
        const companies= await Company.find().sort({created_at:-1});
        res.json(companies);
    } catch(err){
        res.status(500).json({message:'Server Error'});
    }
});


router.post('/apply',requireAuth, async (req,res)=>{
    const {companyId}=req.body;
    const userId=req.session.userId;
    try{
        const student = await Student.findOne({ user: userId });
        const company = await Company.findById(companyId);

        if(!student || !company) return res.status(404).json({message:"Not found"});

        if(company.applicants.some(app=>app.student.toString()=== student._id.toString())){
            return res.status(400).json({message:"Already applied"});
        }
        if (student.basic_info.current_year < company.constraints.min_year) 
            return res.status(400).json({ message: "Year criteria not met" });
        
        if ((student.academic_info.current_cgpa || 0) < company.constraints.min_cgpa) 
            return res.status(400).json({ message: "Low CGPA" });

        if (!company.constraints.history_of_arrears_allowed && student.academic_info.arrear_info.history_of_arrears)
            return res.status(400).json({ message: "History of Arrears not allowed" });

        if (student.academic_info.arrear_info.standing_arrears > company.constraints.max_standing_arrears)
            return res.status(400).json({ message: "Too many standing arrears" });

        if (student.placement_info.is_placed && company.salary <= student.placement_info.current_package)
            return res.status(400).json({ message: "Package too low" });

        
        company.applicants.push({ student: student._id });
        await company.save();

        res.json({ message: "Applied successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});



module.exports = router;