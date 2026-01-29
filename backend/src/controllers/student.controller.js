// create a new student
createStudent: async (req, res) => {
    try {
        const { name, email } = req.body;          
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }}
        const newStudent = new Student({ name, email });
        await newStudent.save();
        res.status(201).json({ message: 'Student created successfully', student: newStudent }); 

// get all students
getAllStudents: async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }       }

// get a student by ID
getStudentById: async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }     res.status(200).json(student);                    
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }     }

// update a student by ID   
updateStudentById: async (req, res) => {
    try {
        const studentId = req.params.id;
        const { name, email } = req.body;
        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            { name, email },
            { new: true }
        );
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }     res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }     }

// delete a student by ID
deleteStudentById: async (req, res) => {
    try {
        const studentId = req.params.id;
        const deletedStudent = await Student.findByIdAndDelete(studentId);
        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }   res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }     }
    