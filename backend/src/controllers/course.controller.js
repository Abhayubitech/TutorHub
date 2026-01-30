const courseService = require("../services/course.service");

async function course (req, res) {
  try {
 
    // const {username,password} = req.body;
    const users = await courseService.course();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// async function  createUser (req, res) {
//   try {
//     const user = req.body
//     const result = await userService.createUser(user);
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



module.exports = {course}