const express = require('express');
const router = express.Router();
const path = require('path');
const nodemailer = require('nodemailer');
const Company = require('../models/Company');
const Student = require('../models/Student');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});


router.get('/admin_dashboard', requireAuth, requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'admin_dashboard.html'));
});

router.get('/add_company', requireAuth, requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'add_company.html'));
});


router.get('/stats', requireAuth, requireAdmin, async (req, res) => {
    try {
        
        const packageStats = await Student.aggregate([
            { $match: { 'placement_info.is_placed': true } },
            { $group: { _id: null, avgPackage: { $avg: "$placement_info.current_package" } } }
        ]);

        
        const placedCount = await Student.countDocuments({ 'placement_info.is_placed': true });
        const totalStudents = await Student.countDocuments({ role: { $ne: 'admin' } }); // Approx

        
        const companyDist = await Student.aggregate([
            { $match: { 'placement_info.is_placed': true } },
            { $group: { _id: "$placement_info.placed_company", count: { $sum: 1 } } }
        ]);

        res.json({
            avgPackage: packageStats[0] ? packageStats[0].avgPackage : 0,
            placedCount,
            unplacedCount: totalStudents - placedCount,
            companyDist
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Stats Error" });
    }
});


router.post('/add-company', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { 
            name, position_role, salary, description,
            min_cgpa, min_year, history_arrears, max_standing_arrears 
        } = req.body;

        
        const newCompany = new Company({
            name, position_role, salary, description,
            constraints: {
                min_cgpa, 
                min_year, 
                history_of_arrears_allowed: history_arrears, 
                max_standing_arrears
            }
        });
        await newCompany.save();

        
        const eligibleStudents = await Student.find({
            'basic_info.current_year': { $gte: min_year },
            'academic_info.current_cgpa': { $gte: min_cgpa },
            'academic_info.arrear_info.standing_arrears': { $lte: max_standing_arrears },
            
            ...(history_arrears === false && { 'academic_info.arrear_info.history_of_arrears': false })
        }).populate('user', 'email');

        //Async
        sendNotificationEmails(eligibleStudents, newCompany);

        res.status(201).json({ 
            message: `Company Added. Notifying ${eligibleStudents.length} eligible students.` 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});


async function sendNotificationEmails(students, company) {
    console.log(`Starting email blast to ${students.length} students...`);
    
    for (const s of students) {
        if (!s.user || !s.user.email) continue;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: s.user.email,
            subject: `New Placement Opportunity: ${company.name}`,
            text: `Hello ${s.basic_info.name},\n\nYou are eligible for a new role at ${company.name} for the position of ${company.position_role}.\nSalary: ${company.salary}\n\nLogin to the portal to apply!`
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (e) {
            console.error(`Failed to email ${s.user.email}`);
        }
    }
}

module.exports = router;