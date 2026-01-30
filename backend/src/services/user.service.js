const db = require("../config/db");

async function authenticateUser (email,password) {
  
     const [result] = await db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email,password]
  );
  // console.log(email,password);
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