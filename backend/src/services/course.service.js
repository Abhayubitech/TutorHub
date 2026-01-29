exports.getPendingRequests = async () => {

  const [rows] = await db.query(
    `SELECT id, user_id, qualification, experience_years, bio
     FROM teacher_profiles
     WHERE status = 'pending'`
  );

  return rows;
};
