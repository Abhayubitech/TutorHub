import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  apiUrl = 'http://localhost:3000/api/courses'; 
  http = inject(HttpClient);

  private getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ 'x-auth-token': token || '' }) };
  }

  getAllCourses() { return this.http.get(this.apiUrl, this.getHeaders()); }
  createCourse(data: any) { return this.http.post(this.apiUrl, data, this.getHeaders()); }
  enroll(sId: number, cId: number) { return this.http.post(`${this.apiUrl}/enroll`, {student_id: sId, course_id: cId}, this.getHeaders()); }
  getTeacherRequests(id: number) { return this.http.get(`${this.apiUrl}/requests/teacher/${id}`, this.getHeaders()); }
  updateRequestStatus(rid: number, st: string, sid: number, cid: number) { return this.http.post(`${this.apiUrl}/requests/status`, {requestId: rid, status: st, studentId: sid, courseId: cid}, this.getHeaders()); }
  getStudentRequests(id: number) { return this.http.get(`${this.apiUrl}/requests/student/${id}`, this.getHeaders()); }
  deleteCourse(id: number) { return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders()); }
  getEnrolledStudents(id: number) { return this.http.get(`${this.apiUrl}/${id}/students`, this.getHeaders()); }

  getCourseById(courseId: number) {
    return this.http.get(`${this.apiUrl}/${courseId}`, this.getHeaders());
  }

  updateCourse(courseId: number, data: any) {
    return this.http.put(`${this.apiUrl}/${courseId}`, data, this.getHeaders());
  }
}