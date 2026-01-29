const scheduleService = require("../services/schedule.service");

exports.addSchedule = async (req, res) => {
  try {
    const result = await scheduleService.addSchedule(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSchedulesByCourse = async (req, res) => {
  try {
    const result = await scheduleService.getSchedulesByCourse(
      req.params.courseId,
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
