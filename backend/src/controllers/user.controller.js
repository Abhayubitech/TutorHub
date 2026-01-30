const userService = require("../services/user.service");
const jwt = require("jsonwebtoken");

async function authenticateUser(req, res) {
  try {
    const { email, password } = req.body; 

    const users = await userService.authenticateUser(email, password);

    if (users.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = users[0];

    const token = jwt.sign(
        { id: user.id, role: user.role, name: user.name }, 
        process.env.JWT_SECRET_KEY
    );

    res.header("x-auth-token", token).json({ 
        message: "Login successful", 
        token: token,
        user: { id: user.id, name: user.name, role: user.role }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function  createUser (req, res) {
  try {
    const user = req.body
    const result = await userService.createUser(user);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = {authenticateUser,createUser}