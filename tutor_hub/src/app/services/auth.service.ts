import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'http://localhost:3000/api/user';
  http = inject(HttpClient);
  constructor() { }
  register(user: any) {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }
  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
}