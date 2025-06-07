import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, NgIf, NgFor]
})
export class DashboardComponent implements OnInit {
  apiKey = '';
  secretKey = '';
  token: string | null = null;
  domainId = '22612de7-0dfa-11ef-baa2-faebddc39855';
  userId = '7090e9d8-0dfa-11ef-baa2-faebddc39855';
  showKeys =true;
  randomNumber: number | null = null; // To store the result

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('accessToken');
  }

  getUserKey(): void {
    if (!this.token) {
      alert('No token found. Please login again.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const body = {
      domainId: this.domainId,
      id: this.userId
    };

    this.http.post<any>('http://localhost:9090/api/cloudstack/getUserKeys', body, { headers })
      .subscribe({
        next: (res) => {
          const userKeys = res.getuserkeysresponse?.userkeys;
          if (userKeys) {
            this.apiKey = userKeys.apikey;
            this.secretKey = userKeys.secretkey;
            this.showKeys =true;
          } else {
            alert('User keys not found.');
          }
        },
        error: () => alert('Failed to load user keys.')
      });
  }

  logout(): void {
    if (!this.token) {
      this.router.navigate(['/login']);
      return;
    }
  
    // Show confirmation dialog
    const confirmed = confirm("Are you sure you want to logout?");
    if (!confirmed) {
      console.log("Logout cancelled");
      return;
    }
  
    // User confirmed logout, proceed with API call
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  
    this.http.get<any>('http://localhost:9090/api/cloudstack/logout', { headers })
      .subscribe({
        next: () => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          this.router.navigate(['/login']);
        },
        error: () => {
          // Even if error, clear tokens and redirect
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          this.router.navigate(['/login']);
        }
      });
  }
  
  random(): void {
    if (!this.token) {
      this.router.navigate(['/login']);
      return;
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  
    this.http.get<number>('http://localhost:9090/api/cloudstack/random', { headers })
      .subscribe({
        next: (res) => {
          this.randomNumber = res;
        },
        error: () => alert('Failed to fetch random number.')
      });
  }
}
