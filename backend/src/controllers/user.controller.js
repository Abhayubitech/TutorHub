const userService = require("../services/user.service");

async function authenticateUser(req, res) {
  try {
    const { email, password } = req.body; // Changed from username to email to match service
    const result = await userService.authenticateUser(email, password);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
async function createUser(req, res) {
  try {
    const user = req.body
    const result = await userService.createUser(user);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = { authenticateUser, createUser }