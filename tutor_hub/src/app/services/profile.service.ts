import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  http = inject(HttpClient);
  baseUrl = 'http://localhost:3000/api'; 

  public profileUpdated$ = new Subject<void>();

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({ 'x-auth-token': token || '' })
    };
  }

  updateProfile(role: string, formData: FormData) {
    return this.http.post(`${this.baseUrl}/${role}/profile`, formData, this.getHeaders());
  }

  getProfileData(role: string, userId: number) {
    return this.http.get(`${this.baseUrl}/${role}/profile/${userId}`, this.getHeaders());
  }
}