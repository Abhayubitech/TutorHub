const userService = require('../services/user.service');

const registerUser = async (req, res) => {
  try {
    const result = await userService.registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const result = await userService.loginUser(req.body);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};



const createCourse = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const result = await userService.createCourse(teacherId, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const requestCourse = async (req, res) => {
  try {
    const result = await userService.requestCourse(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const approveRequest = async (req, res) => {
  try {
    const result = await userService.approveRequest(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const result = await userService.getAllCourses();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const result = await userService.rejectRequest(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const courseId = req.params.courseId;

    const result = await userService.updateCourse(
      teacherId,
      courseId,
      req.body
    );

    res.json(result);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const courseId = req.params.courseId;

    const result = await userService.deleteCourse(teacherId, courseId);
    res.json(result);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  createCourse,
  requestCourse,
  approveRequest,
  getAllCourses,
  rejectRequest,
  updateCourse,
  deleteCourse,
  loginUser
};
