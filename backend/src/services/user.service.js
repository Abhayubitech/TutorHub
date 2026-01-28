const db = require("../config/db");

async function authenticateUser (username,password) {
    
     const [result] = await db.query(
    "SELECT * FROM users WHERE password = ? AND (email = ? OR phone = ?)",
    [password,username,username]
  );
   return result
};
async function createUser (user) {
    const {name,email,password,role,phone} = user
     const [result] = await db.query(
    "insert into users (name,email,password,role,phone) values (?,?,?,?,?)",
    [name,email,password,role,phone]
  );
   return result
};



module.exports = {authenticateUser,createUser}