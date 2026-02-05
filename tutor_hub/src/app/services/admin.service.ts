import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  http = inject(HttpClient);
  apiUrl = 'http://localhost:3000/api/admin'; 

  private getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ 'x-auth-token': token || '' }) };
  }

  getStats() {
    return this.http.get(`${this.apiUrl}/stats`, this.getHeaders());
  }

  getStudents() {
    return this.http.get(`${this.apiUrl}/students`, this.getHeaders());
  }

  getTeachers() {
    return this.http.get(`${this.apiUrl}/teachers`, this.getHeaders());
  }

  deleteUser(userId: number) {
    return this.http.delete(`${this.apiUrl}/users/${userId}`, this.getHeaders());
  }

  getCourseDetails(courseName: string, teacherId: number) {
    return this.http.get(`${this.apiUrl}/course-details?name=${courseName}&teacherId=${teacherId}`, this.getHeaders());
  }

  deleteCourse(courseId: number) {
    return this.http.delete(`${this.apiUrl}/courses/${courseId}`, this.getHeaders());
  }
}