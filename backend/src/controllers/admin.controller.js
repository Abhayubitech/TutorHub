const adminService = require("../services/admin.service");

function shouldIncludeDummy(req) {
  const includeDummy = String(req.query?.includeDummy || '').toLowerCase() === 'true';
  return includeDummy && String(process.env.NODE_ENV || '').toLowerCase() !== 'production';
}

function getDummyUsers(role) {
  const all = [
    { id: 'dummy-admin-1', name: 'Demo Admin', email: 'demo.admin@tutorhub.local', role: 'admin', phone: '9999999999', created_at: new Date().toISOString(), is_dummy: true },
    { id: 'dummy-teacher-1', name: 'Demo Teacher', email: 'demo.teacher@tutorhub.local', role: 'teacher', phone: '8888888888', created_at: new Date().toISOString(), is_dummy: true },
    { id: 'dummy-student-1', name: 'Demo Student', email: 'demo.student@tutorhub.local', role: 'student', phone: '7777777777', created_at: new Date().toISOString(), is_dummy: true },
  ];
  return role ? all.filter(u => u.role === role) : all;
}

function getDummyCourses() {
  return [
    {
      id: 'dummy-course-1',
      teacher_id: 'dummy-teacher-1',
      subject: 'Mathematics',
      description: 'A structured course covering fundamentals to intermediate topics.',
      fee: 499,
      mode: 'online',
      start_date: null,
      end_date: null,
      teacher_name: 'Demo Teacher',
      teacher_email: 'demo.teacher@tutorhub.local',
      is_dummy: true,
    },
    {
      id: 'dummy-course-2',
      teacher_id: 'dummy-teacher-1',
      subject: 'English Speaking',
      description: 'Improve fluency, vocabulary, and confidence with weekly sessions.',
      fee: 599,
      mode: 'offline',
      start_date: null,
      end_date: null,
      teacher_name: 'Demo Teacher',
      teacher_email: 'demo.teacher@tutorhub.local',
      is_dummy: true,
    },
  ];
}

function getDummyManageOverview() {
  return {
    teacherCourses: [
      {
        teacher_id: 'dummy-teacher-1',
        teacher_name: 'Demo Teacher',
        teacher_email: 'demo.teacher@tutorhub.local',
        course_id: 'dummy-course-1',
        subject: 'Mathematics',
        description: 'A structured course covering fundamentals to intermediate topics.',
        fee: 499,
        mode: 'online',
        start_date: null,
        end_date: null,
        is_dummy: true,
      },
      {
        teacher_id: 'dummy-teacher-2',
        teacher_name: 'Sample Teacher',
        teacher_email: 'sample.teacher@tutorhub.local',
        course_id: null,
        subject: null,
        description: null,
        fee: null,
        mode: null,
        start_date: null,
        end_date: null,
        is_dummy: true,
      },
    ],
    studentEnrollments: [
      {
        student_id: 'dummy-student-1',
        student_name: 'Demo Student',
        student_email: 'demo.student@tutorhub.local',
        course_id: 'dummy-course-1',
        subject: 'Mathematics',
        mode: 'online',
        fee: 499,
        teacher_id: 'dummy-teacher-1',
        teacher_name: 'Demo Teacher',
        enrolled_at: new Date().toISOString(),
        is_dummy: true,
      },
      {
        student_id: 'dummy-student-2',
        student_name: 'Sample Student',
        student_email: 'sample.student@tutorhub.local',
        course_id: null,
        subject: null,
        mode: null,
        fee: null,
        teacher_id: null,
        teacher_name: null,
        enrolled_at: null,
        is_dummy: true,
      },
    ],
  };
}

function ensureAdmin(req, res) {
  if (!req.user?.id) {
    res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
    return false;
  }
  if (req.user.role !== "admin") {
    res.status(403).json({ success: false, message: "Forbidden - Admin access required" });
    return false;
  }
  return true;
}

async function getUsers(req, res) {
  try {
    if (!ensureAdmin(req, res)) return;
    const role = req.query?.role ? String(req.query.role) : undefined;
    const users = await adminService.getUsers(role);
    const nextUsers = shouldIncludeDummy(req) ? [...users, ...getDummyUsers(role)] : users;
    res.json({ success: true, users: nextUsers });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function getRecentUsers(req, res) {
  try {
    if (!ensureAdmin(req, res)) return;
    const limit = req.query?.limit;
    const users = await adminService.getRecentUsers(limit);
    const safeLimit = Number.isFinite(Number(limit)) ? Math.max(1, Math.min(100, Number(limit))) : 10;
    const remaining = Math.max(0, safeLimit - users.length);
    const fillDummies = shouldIncludeDummy(req) && remaining > 0 ? getDummyUsers().slice(0, remaining) : [];
    const nextUsers = [...users, ...fillDummies];
    res.json({ success: true, users: nextUsers });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function updateUser(req, res) {
  try {
    if (!ensureAdmin(req, res)) return;
    const { userId } = req.params;
    const targetUserId = userId === 'self' ? String(req.user.id) : String(userId);
    const result = await adminService.updateUser(targetUserId, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    if (!ensureAdmin(req, res)) return;
    const { userId } = req.params;
    const targetUserId = userId === 'self' ? String(req.user.id) : String(userId);
    const result = await adminService.deleteUser(targetUserId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function getAllCourses(req, res) {
  try {
    if (!ensureAdmin(req, res)) return;
    const courses = await adminService.getAllCourses();
    const nextCourses = shouldIncludeDummy(req) ? [...courses, ...getDummyCourses()] : courses;
    res.json({ success: true, courses: nextCourses });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function getManageOverview(req, res) {
  try {
    if (!ensureAdmin(req, res)) return;
    const teacherCourseRows = await adminService.getTeacherCourseMappings();
    const studentEnrollmentRows = await adminService.getStudentEnrollmentMappings();

    const dummy = shouldIncludeDummy(req) ? getDummyManageOverview() : null;

    res.json({
      success: true,
      manage: {
        teacherCourses: dummy ? [...teacherCourseRows, ...dummy.teacherCourses] : teacherCourseRows,
        studentEnrollments: dummy ? [...studentEnrollmentRows, ...dummy.studentEnrollments] : studentEnrollmentRows,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = {
  getUsers,
  getRecentUsers,
  updateUser,
  deleteUser,
  getAllCourses,
  getManageOverview,
};
