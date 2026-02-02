import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  
  // 1. Inject HttpClient
  private http = inject(HttpClient);

  // 2. Define your API Base URL (Change this to match your backend port)
  private apiUrl = 'http://localhost:3000/user'; 

  constructor() { }

  // --- METHODS ---

  // 3. Get Profile Data
  getStudentProfile(): Observable<any> {
    // const token = localStorage.getItem('token');
    // const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/profile/${localStorage.getItem('token')}`);
  }

  // 4. Update Profile Data
  updateStudentProfile(data: any): Observable<any> {
    // const token = localStorage.getItem('token');
    // const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.put(`${this.apiUrl}/profile/${localStorage.getItem('token')}`, data);
  }
}