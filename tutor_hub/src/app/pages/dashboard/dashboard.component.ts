import { Component, inject, OnInit, signal } from '@angular/core'; 
import { Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { SweetToastService } from '../../services/sweet-toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  courseService = inject(CourseService);
  router = inject(Router);
  datePipe = inject(DatePipe);
  toast = inject(SweetToastService);

  user: any = null;

  courses = signal<any[]>([]);
  requests = signal<any[]>([]);
  enrolledList = signal<any[]>([]);
  myApplications = signal<any[]>([]);

  activeTab = signal<string>('courses');
  
  showCourseModal = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  editingCourseId = signal<number | null>(null);

  showProfileModal = signal<boolean>(false);
  selectedStudent = signal<any>(null);
  showTeacherModal = signal<boolean>(false);
  selectedTeacher = signal<any>(null);
  showScheduleModal = signal<boolean>(false);
  selectedCourseSchedule = signal<any>(null);

  courseForm = signal({
    subject: '', description: '', fee: null, mode: 'online', start_date: '', end_date: ''
  });

  scheduleList = signal([{ day: 'Monday', start_time: '', end_time: '' }]);
  daysOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  ngOnInit() {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.user = JSON.parse(userString);
      if (this.user.role === 'student') {
        this.activeTab.set('available');
      }
      this.loadData();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadData() {
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        if (this.user?.role === 'teacher') {
          const myCourses = res.filter((c: any) => c.teacher_id === this.user.id);
          this.courses.set(myCourses);
          this.loadTeacherData();
        } else {
          this.courses.set(res);
          this.loadStudentApplications();
        }
      },
      error: (err) => console.error("Error loading courses", err)
    });
  }

  loadTeacherData() {
    this.courseService.getTeacherRequests(this.user.id).subscribe({
      next: (res: any) => {
        this.requests.set(res.filter((r: any) => r.status === 'pending'));
        this.enrolledList.set(res.filter((r: any) => r.status === 'approved'));
      }
    });
  }

  loadStudentApplications() {
    this.courseService.getStudentRequests(this.user.id).subscribe({
      next: (res: any) => this.myApplications.set(res)
    });
  }

  getFilteredCourses() {
    const allCourses = this.courses();
    const myApps = this.myApplications();
    const tab = this.activeTab();

    if (this.user?.role === 'teacher') return allCourses; 

    return allCourses.filter(course => {
      const app = myApps.find(a => a.course_id === course.id);
      const status = app ? app.status : null;

      if (tab === 'available') return !status; 
      if (tab === 'enrolled') return status === 'approved';
      if (tab === 'pending') return status === 'pending';
      if (tab === 'rejected') return status === 'rejected';
      return false;
    });
  }
  
  getCount(status: string) {
      if (status === 'available') return this.courses().filter(c => !this.myApplications().find(a => a.course_id === c.id)).length;
      return this.myApplications().filter(a => a.status === status).length;
  }

  openCreateCourseModal() {
      this.resetForm();
      this.isEditing.set(false);
      this.showCourseModal.set(true);
  }

  startEditing(courseId: number) {
    this.courseService.getCourseById(courseId).subscribe({
        next: (res: any) => {
            const formattedStart = this.datePipe.transform(res.start_date, 'yyyy-MM-dd') || '';
            const formattedEnd = this.datePipe.transform(res.end_date, 'yyyy-MM-dd') || '';

            this.courseForm.set({
                subject: res.subject, description: res.description, fee: res.fee, mode: res.mode,
                start_date: formattedStart, end_date: formattedEnd
            });

            if (res.schedules && res.schedules.length > 0) {
                this.scheduleList.set(res.schedules);
            } else {
                this.scheduleList.set([{ day: 'Monday', start_time: '', end_time: '' }]);
            }

            this.isEditing.set(true);
            this.editingCourseId.set(courseId);
            this.showCourseModal.set(true);
        }
    });
  }

  closeCourseModal() {
      this.showCourseModal.set(false);
      this.resetForm();
  }

  resetForm() {
      this.courseForm.set({ subject: '', description: '', fee: null, mode: 'online', start_date: '', end_date: '' });
      this.scheduleList.set([{ day: 'Monday', start_time: '', end_time: '' }]);
      this.isEditing.set(false);
      this.editingCourseId.set(null);
  }

  submitCourse() {
    if (!this.user) return;
    const payload = { ...this.courseForm(), teacher_id: this.user.id, schedules: this.scheduleList() };

    if (this.isEditing()) {
        this.courseService.updateCourse(this.editingCourseId()!, payload).subscribe({
            next: () => { 
                this.toast.success("Course Updated Successfully! ✅"); 
                this.loadData(); 
                this.closeCourseModal(); 
            },
            error: () => this.toast.error("Update Failed ❌")
        });
    } else {
        this.courseService.createCourse(payload).subscribe({
            next: () => { 
                this.toast.success("Course Launched Successfully! 🚀"); 
                this.loadData(); 
                this.closeCourseModal(); 
            },
            error: () => this.toast.error("Creation Failed ❌")
        });
    }
  }

  async deleteCourse(courseId: number) {
    const isConfirmed = await this.toast.confirm(
        'Delete Course?', 
        "You won't be able to revert this!", 
        'Yes, Delete it!', 
        '#d33'
    );

    if (isConfirmed) {
        this.courseService.deleteCourse(courseId).subscribe({ 
            next: () => {
                this.toast.warning("Course Deleted Successfully 🗑️");
                this.loadData();
            },
            error: () => this.toast.error("Failed to delete course ❌")
        });
    }
  }

  async handleRequest(req: any, status: 'approved' | 'rejected') {
    const action = status === 'approved' ? 'Approve' : 'Reject';
    const color = status === 'approved' ? '#28a745' : '#d33';

    const isConfirmed = await this.toast.confirm(
        `${action} Request?`, 
        `Do you want to ${action} ${req.student_name}?`, 
        `Yes, ${action}`, 
        color
    );

    if (isConfirmed) {
        this.courseService.updateRequestStatus(req.request_id, status, req.student_id, req.course_id)
        .subscribe({
            next: () => { 
                this.toast.success(`Request ${status} successfully! ✅`); 
                this.loadTeacherData(); 
            },
            error: () => this.toast.error("Error updating status ❌")
        });
    }
  }

  async apply(courseId: any) {
    if (!this.user) return;

    const isConfirmed = await this.toast.confirm(
        'Apply for Course?', 
        "Do you want to enroll in this course?", 
        'Yes, Apply!', 
        '#3085d6'
    );

    if (isConfirmed) {
        this.courseService.enroll(Number(this.user.id), Number(courseId)).subscribe({
            next: () => { 
                this.toast.success("Request Sent Successfully! 📩"); 
                this.loadStudentApplications(); 
            },
            error: (err) => this.toast.error(err.error?.message || "Error applying ❌")
        });
    }
  }

  viewStudentProfile(student: any) {
    this.selectedStudent.set(student);
    this.showProfileModal.set(true);
  }

  closeProfileModal() {
    this.showProfileModal.set(false);
    this.selectedStudent.set(null);
  }

  getApplicationStatus(courseId: number) {
    const app = this.myApplications().find(a => a.course_id === courseId);
    return app ? app.status : null;
  }

  viewTeacherProfile(course: any) {
    this.selectedTeacher.set({
        name: course.teacher_name, pic: course.teacher_pic, qualifications: course.teacher_qualifications, bio: course.teacher_bio
    });
    this.showTeacherModal.set(true);
  }

  closeTeacherModal() {
    this.showTeacherModal.set(false);
    this.selectedTeacher.set(null);
  }

  viewSchedule(courseId: number) {
    this.courseService.getCourseById(courseId).subscribe({
        next: (res: any) => {
            this.selectedCourseSchedule.set(res);
            this.showScheduleModal.set(true);
        },
        error: () => this.toast.error("Could not load schedule ❌")
    });
  }

  closeScheduleModal() {
    this.showScheduleModal.set(false);
    this.selectedCourseSchedule.set(null);
  }

  addScheduleRow() {
    this.scheduleList.update(list => [...list, { day: 'Monday', start_time: '', end_time: '' }]);
  }

  removeScheduleRow(index: number) {
    this.scheduleList.update(list => list.filter((_, i) => i !== index));
  }
}