import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  // Auth endpoints
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  signup(name: string, email: string, password: string, role: string, phone?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, { name, email, password, role, phone });
  }

  // User endpoints
  getUser(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/${id}`, { headers: this.getHeaders() });
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/${id}`, userData, { headers: this.getHeaders() });
  }

  updateUserProfile(id: string, profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/${id}`, profileData, { headers: this.getHeaders() });
  }

  // Teacher endpoints
  getTeacherProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/teacher/profile`, { headers: this.getHeaders() });
  }

  updateTeacherProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/teacher/profile`, profileData, { headers: this.getHeaders() });
  }

  getTeacherCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/teacher/courses`, { headers: this.getHeaders() });
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/teacher/courses`, courseData, { headers: this.getHeaders() });
  }

  updateCourse(courseId: string, courseData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/teacher/courses/${courseId}`, courseData, { headers: this.getHeaders() });
  }

  deleteCourse(courseId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/teacher/courses/${courseId}`, { headers: this.getHeaders() });
  }

  addCourseSchedule(courseId: string, scheduleData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/teacher/courses/${courseId}/schedule`, scheduleData, { headers: this.getHeaders() });
  }

  getEnrollmentRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/teacher/enrollment-requests`, { headers: this.getHeaders() });
  }

  handleEnrollmentRequest(requestId: string, action: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/teacher/enrollment-requests/${requestId}`, { action }, { headers: this.getHeaders() });
  }

  getEnrolledStudents(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/teacher/courses/${courseId}/students`, { headers: this.getHeaders() });
  }

  // Student endpoints
  getAllCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/courses`);
  }

  getCourseDetails(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/courses/${courseId}`);
  }

  searchCourses(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/courses/search`, { params: { query } });
  }

  requestEnrollment(courseId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/student/enroll`, { courseId }, { headers: this.getHeaders() });
  }

  getMyRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/my-requests`, { headers: this.getHeaders() });
  }

  getMyEnrollments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/my-enrollments`, { headers: this.getHeaders() });
  }

  cancelRequest(requestId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/student/requests/${requestId}`, { headers: this.getHeaders() });
  }

  getAllTeachers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/teachers`);
  }

  getTeacherDetails(teacherId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/teachers/${teacherId}`);
  }

  // Course endpoints
  listAllCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses`);
  }

  // Admin endpoints
  getAllUsers(includeDummy: boolean = false): Observable<any> {
    const qs = includeDummy ? '?includeDummy=true' : '';
    return this.http.get(`${this.apiUrl}/admin/users${qs}`, { headers: this.getHeaders() });
  }

  getUsersByRole(role: string, includeDummy: boolean = false): Observable<any> {
    const qs = includeDummy ? `?role=${role}&includeDummy=true` : `?role=${role}`;
    return this.http.get(`${this.apiUrl}/admin/users${qs}`, { headers: this.getHeaders() });
  }

  deleteUserAdmin(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${userId}`, { headers: this.getHeaders() });
  }

  updateUserAdmin(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/users/${userId}`, userData, { headers: this.getHeaders() });
  }

  getRecentUsers(limit: number = 10, includeDummy: boolean = false): Observable<any> {
    const qs = includeDummy ? `?limit=${limit}&includeDummy=true` : `?limit=${limit}`;
    return this.http.get(`${this.apiUrl}/admin/recent-users${qs}`, { headers: this.getHeaders() });
  }

  getAllCoursesAdmin(includeDummy: boolean = false): Observable<any> {
    const qs = includeDummy ? '?includeDummy=true' : '';
    return this.http.get(`${this.apiUrl}/admin/courses${qs}`, { headers: this.getHeaders() });
  }

  getAdminManageOverview(includeDummy: boolean = false): Observable<any> {
    const qs = includeDummy ? '?includeDummy=true' : '';
    return this.http.get(`${this.apiUrl}/admin/manage${qs}`, { headers: this.getHeaders() });
  }

  // Generic HTTP methods
  get(endpoint: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${endpoint}`, { headers: this.getHeaders() });
  }

  post(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${endpoint}`, data, { headers: this.getHeaders() });
  }

  put(endpoint: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${endpoint}`, data, { headers: this.getHeaders() });
  }

  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${endpoint}`, { headers: this.getHeaders() });
  }

  // WhatsApp and payment endpoints
  uploadPaymentScreenshot(courseId: string, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
    return this.http.post(`${this.apiUrl}/courses/payment/upload`, formData, { headers });
  }

  getStudentPaymentStatus(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/payment/status/${courseId}`, { headers: this.getHeaders() });
  }

  // WhatsApp group endpoints
  getWhatsAppGroup(courseId: string, groupType: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/whatsapp-group/${courseId}?groupType=${groupType}`, { headers: this.getHeaders() });
  }

  createWhatsAppGroup(groupData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/whatsapp-group`, groupData, { headers: this.getHeaders() });
  }

  getPaymentVerifications(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/payment/verifications/${courseId}`, { headers: this.getHeaders() });
  }

  updatePaymentVerification(verificationId: string, status: string, teacherNotes: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/courses/payment/verify/${verificationId}`, { status, teacherNotes }, { headers: this.getHeaders() });
  }
}
