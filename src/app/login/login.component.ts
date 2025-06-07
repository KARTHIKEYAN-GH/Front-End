import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as CryptoJS from 'crypto-js';
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
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  // ✅ Move this function OUTSIDE login()
  encryptPassword(plainText: string): string {
    const SECRET_KEY = '1234567890abcdef'; // Must match backend
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  login() {
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Username and password are required!';
      return;
    }

    const encryptedPassword = this.encryptPassword(this.password);

    const payload = {
      username: this.username,
      password: encryptedPassword
    };

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
