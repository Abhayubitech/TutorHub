let createTeacherProfile= require('../services/teacher.service')

exports.createTeacherProfile = async (req, res) => {
  try {
    const data = await createTeacherProfile.createTeacherProfile(req.body);

    res.status(201).json({
      message: "Teacher profile created",
      data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTeacher = async (req,res)=>{
    try{
const teachers = await createTeacherProfile.getAllTeachers()
res.json(teachers)
    }
    catch(e){
        res.status(500).json({ error: err.message });

    }
}
exports.getTeacherById  = async (req , res)=>{

    try{
        const teacher = await createTeacherProfile.getTeacherById()
        res.json(teacher)
        

    }
    catch(e){


    }
}

const teacherService = require('../services/teacher.service');

exports.updateTeacherProfile = async (req, res) => {
  try {
    const result = await teacherService.updateTeacherProfile(req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Teacher profile not found"
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      data: req.body
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
