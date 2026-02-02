const db = require('../config/db');
const profileService = require('../services/profile.service');

// 1. Get Profile
const getProfile = async (req, res) => {
    try {
        const userId = req.params.id; // From Auth Middleware

        // Check if profile exists
        const q = "SELECT * FROM profile_details WHERE user_id = ?";
        const [rows] = await db.query(q, [userId]);

        if (rows.length === 0) {
            // If no profile detail exists, fallback to basic user info from users table
            const userQ = "SELECT name, email FROM users WHERE id = ?";
            const [userRows] = await db.query(userQ, [userId]);
            return res.status(200).json(userRows[0]); 
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Update/Create Profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, phone, qualifications, address, bio } = req.body;

        // Check if profile exists
        const checkQ = "SELECT id FROM profile_details WHERE user_id = ?";
        const [existing] = await db.query(checkQ, [userId]);

        if (existing.length > 0) {
            // UPDATE existing profile
            const updateQ = `
                UPDATE profile_details 
                SET name=?, email=?, phone=?, qualifications=?, address=?, bio=? 
                WHERE user_id=?
            `;
            await db.query(updateQ, [name, email, phone, qualifications, address, bio, userId]);
            res.status(200).json({ message: "Profile updated successfully!" });
        } else {
            // INSERT new profile
            const insertQ = `
                INSERT INTO profile_details (user_id, name, email, phone, qualifications, address, bio) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            await db.query(insertQ, [userId, name, email, phone, qualifications, address, bio]);
            res.status(200).json({ message: "Profile created successfully!" });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getProfile, updateProfile };