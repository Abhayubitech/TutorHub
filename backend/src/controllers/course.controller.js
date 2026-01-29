exports.getPendingRequests = async (req, res) => {
  try {
    const data = await teacherService.getPendingRequests();

    res.status(200).json({
      pendingRequests: data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
