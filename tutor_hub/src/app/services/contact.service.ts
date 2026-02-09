import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  submitContactForm(contactData: { name: string; email: string; subject: string; message: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact`, contactData);
  }
}
