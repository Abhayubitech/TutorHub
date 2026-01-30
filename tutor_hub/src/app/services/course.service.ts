import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000'; // Backend URL

  // Token header mein lagane ke liye helper
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // 1. Saare Courses lana
  getAllCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Tutor_hub/course`, this.getHeaders());
  }

  // 2. Course Enroll Request bhejna
  requestEnrollment(courseId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/enroll/request`, 
      { courseId }, 
      this.getHeaders()
    );
  }
}