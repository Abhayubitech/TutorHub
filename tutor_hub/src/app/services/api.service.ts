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
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users`, { headers: this.getHeaders() });
  }

  getUsersByRole(role: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users?role=${role}`, { headers: this.getHeaders() });
  }

  deleteUserAdmin(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${userId}`, { headers: this.getHeaders() });
  }

  updateUserAdmin(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/users/${userId}`, userData, { headers: this.getHeaders() });
  }

  getRecentUsers(limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/recent-users?limit=${limit}`, { headers: this.getHeaders() });
  }

  getAllCoursesAdmin(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/courses`, { headers: this.getHeaders() });
  }
}
