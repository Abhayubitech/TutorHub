import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RequestService {
    private http = inject(HttpClient);
    private apiUrl = '/api/requests';

    createRequest(courseId: number): Observable<any> {
        return this.http.post(this.apiUrl, { course_id: courseId });
    }

    getTeacherRequests(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/teacher`);
    }

    updateRequestStatus(requestId: number, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${requestId}`, { status });
    }

    getMyEnrollments(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/my-enrollments`);
    }
}
