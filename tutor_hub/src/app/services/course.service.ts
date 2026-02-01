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
    console.log(token);
    
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

// ... imports

// Class ke andar ye function add karo
getMyRequests(): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  console.log(headers);
  
  
  return this.http.get(`${this.apiUrl}/Tutor_hub/request-enrollment`, { headers });
}

  // 2. Course Enroll Request bhejna
  requestEnrollment(courseId: number, studentId: number): Observable<any> {
    
    return this.http.post(
      `${this.apiUrl}/Tutor_hub/request-enrollment`, 
      { courseId, studentId }, 
      // this.getHeaders()
    );
  }
}