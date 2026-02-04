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
  // const token = localStorage.getItem('token');
  // const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  // console.log(headers);
  
  
  return this.http.get(`${this.apiUrl}/Tutor_hub/my-requests/courses/${localStorage.getItem('token')}`);
}

  // 2. Course Enroll Request bhejna
  requestEnrollment(courseId: number, studentId: number): Observable<any> {
    
    return this.http.post(
      `${this.apiUrl}/Tutor_hub/request-enrollment`, 
      { courseId, studentId }, 
      // this.getHeaders()
    );
  }

  // Angular Service
getTeacherCourses(teacherId: number) {
  return this.http.get(`${this.apiUrl}/teacher/courses/${teacherId}`);
}

getTeacherRequests(teacherId: number) {
  return this.http.get(`${this.apiUrl}/teacher/requests/${teacherId}`);
}

// Approve/Reject logic
updateRequestStatus(requestId: number, status: 'accepted' | 'rejected') {
  // console.log(requestId,status);
  // Ab URL banega: /api/teacher/5/102 (Jahan 5 teacherId hai aur 102 requestId)
return this.http.put(`${this.apiUrl}/teacher/requests/${requestId}`, { status });

  // return this.http.put(`${this.apiUrl}/teacher/:id/${requestId}`, { status });
}


// Create New Course
  createCourse(courseData: any) {
    return this.http.post(`${this.apiUrl}/teacher/create-course`, courseData);
  }

  // Update Existing Course
  updateCourse(id: number, courseData: any) {
    return this.http.put(`${this.apiUrl}/teacher/update-course/${id}`,[courseData,localStorage.getItem('token')]);
  }

  // 9. Get Approved/Enrolled Courses (For 'My Learning' Tab)
  getEnrolledCourses(studentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Tutor_hub/enrolled/${studentId}`);
  }
}