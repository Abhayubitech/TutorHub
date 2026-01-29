const express = require('express');
const dotenv = require('dotenv');

dotenv.config(); 

const app = express(); 

app.use(express.json()); 
const userRoutes = require('./routes/user.routes');
const teacherRoutes = require('./routes/teacher.routes');
const studentRoutes = require('./routes/student.routes');
const scheduleRoutes = require('./routes/schedule.routes');

app.use('/api/users', userRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/schedules', scheduleRoutes);

module.exports = app;
