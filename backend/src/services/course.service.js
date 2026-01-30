const db = require("../config/db");

async function course () {
    
     const [result] = await db.query(
    "SELECT * FROM courses",
  );
   return result
};
// async function createUser (user) {
//     const {name,email,password,role,phone} = user
//      const [result] = await db.query(
//     "insert into users (name,email,password,role,phone) values (?,?,?,?,?)",
//     [name,email,password,role,phone]
//   );
//    return result
// };



module.exports = {course}