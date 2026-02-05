const db = require("../config/db");
const bcrypt = require("bcryptjs"); 

async function authenticateUser(email, plainPassword) {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
        return null; 
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(plainPassword, user.password);
    if (isMatch) {
        return user;
    } else {
        return null; 
    }
}

async function createUser(userData) {
    const { name, email, password, role, phone } = userData; 
    
    const [existingUser] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    
    if (existingUser.length > 0) {
        const error = new Error("Email already existed");
        error.status = 400;
        throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
        "INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, role, phone]
    );
    return result;
}

module.exports = { authenticateUser, createUser };