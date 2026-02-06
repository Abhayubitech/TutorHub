const db = require('./src/config/db');

(async () => {
  try {
    // Check if course 16 exists
    const [course] = await db.query('SELECT * FROM courses WHERE id = 16');
    console.log('Course 16:', course);
    
    // Check WhatsApp groups for course 16
    const [groups] = await db.query('SELECT * FROM whatsapp_groups WHERE course_id = 16');
    console.log('WhatsApp groups for course 16:', groups);
    
    // Check all courses
    const [allCourses] = await db.query('SELECT id, subject FROM courses ORDER BY id DESC LIMIT 5');
    console.log('Latest courses:', allCourses);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
