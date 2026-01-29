import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    private http = inject(HttpClient);
    private apiUrl = '/api/courses';

    getAllCourses(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getMyCourses(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/my-courses`);
    }

    createCourse(course: any): Observable<any> {
        return this.http.post(this.apiUrl, course);
    }
}
