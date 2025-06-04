import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  constructor(private http: HttpClient, private router:Router) {}

  onLogin() {
    // Client-side validation
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Username and password are required!';
      return;
    }
  
    const loginPayload = {
      username: this.username,
      password: this.password
    };
  
    this.http.post<any>('http://localhost:9090/api/cloudstack/login', loginPayload)
      .subscribe({
        next: (response) => {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          alert('Login successful! and check local storage');
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.errorMessage = 'Invalid credentials!';
        }
      });
  }
  
}
