const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile.controller");

router.get('/',(req,res)=>{
    res.send("Profile route working");
});
router.get('/profile/:id', profileController.getProfile)
router.put('/profile/:id', profileController.updateProfile);
// router.post('/signup', courseController.createUser)
module.exports = router;
