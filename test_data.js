const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Student = require('./models/Student');
const Company = require('./models/Company');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('🔌 Connected. Inserting Test Data...');
        
        // remove old data
        await User.deleteMany({ email: { $in: ['admin@college.edu', 'student@college.edu'] } });
        await Student.deleteMany({ 'basic_info.name': 'Test Student' });
        await Company.deleteMany({ name: 'Tech Corp' });

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(process.env.EMAIL_PASS, salt); 

        //sample admin
        const adminUser = await new User({
            email: process.env.EMAIL_USER,
            password: hashedPassword,
            role: 'admin',
            student_profile: null
        }).save();
        console.log('Admin Created:');

        //sample student
        const studentUser = new User({
            email: "231001042@rajalakshmi.edu.in",
            password: hashedPassword,
            role: 'student',
            student_profile: null // We will link this in a second
        });
        const savedStudentUser = await studentUser.save();

        
        const studentProfile = await new Student({
            user: savedStudentUser._id, 
            basic_info: {
                name: 'Test Student',
                gender: 'Male',
                fathers_name: 'Father Name',
                mothers_name:'Mother Name',
                current_year: 4,  
                resume_link: 'http://resume.com'
            },
            academic_info: {
                current_cgpa: 8.5, 
                grades: [],
                arrear_info: {
                    history_of_arrears: false, 
                    standing_arrears: 0
                }
            },
            placement_info: {
                is_placed: false
            }
        }).save();

        
        savedStudentUser.student_profile = studentProfile._id;
        await savedStudentUser.save();
        
        console.log('Student Created');

        
        const company = await new Company({
            name: 'Tech Corp',
            position_role: 'SDE-1',
            salary: 1200000,
            description: 'A great place to work.',
            constraints: {
                min_cgpa: 7.0,       
                min_year: 3,
                history_of_arrears_allowed: true, 
                max_standing_arrears: 2
            },
            applicants: []
        }).save();
        console.log('Company Created: Tech Corp (Eligibility Matched)');

        console.log('\nDone! You can now login and test.');
        process.exit();
    })
    .catch(err => console.log(err));