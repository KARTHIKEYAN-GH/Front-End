import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent {
  username = '';
  password = '';
  errorMessage =''
  constructor(private http: HttpClient, private router: Router) {}

  login() {
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Username and password are required!';
      return;
    }
  
    const payload = { username: this.username, password: this.password };
    this.http.post<any>('http://localhost:9090/api/cloudstack/login', payload).subscribe({
      next: (res) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        this.router.navigate(['/dashboard']);
      },
      error: () => alert('Invalid login')
    });
  }
}
