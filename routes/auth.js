const express=require('express');
const bcrypt=require('bcryptjs');
const User=require('../models/User');
const router=express.Router();


router.post('/login',async(req,res)=>{
	const {email, password}=req.body;
	try{
		const user = await User.findOne({email});
		if(!user){
			return res.status(400).json({message:"User does not exist"});
		}
		const isMatch= await bcrypt.compare(password, user.password);
		if(!isMatch){
			return res.status(400).json({message:"Invalid Credentials"});
		}

		req.session.userId=user._id;
		res.json({
			message:"Login Successful",
			user:{
				email:user.email,
				role:user.role,
				hasProfile: !!user.student_profile
			}
		});
	} catch(err){
		console.error(err);
		res.status(500).json({message:"Server Error"});
	}
});

router.post('/logout', (req,res)=>{
	req.session=null;
	res.json({message:"Logged out"});
});

router.get('/current_user', async(req,res)=>{
	if(!req.session.userId){
		return res.status(401).json({user:null});
	}
	const user= await User.findById(req.session.userId).select('-password');
	res.json({user});
});

module.exports=router;