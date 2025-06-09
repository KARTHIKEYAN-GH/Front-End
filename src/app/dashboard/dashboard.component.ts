import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, NgIf, NgFor]
})
export class DashboardComponent {
  apiKey = '';
  secretKey = '';
  domainId = '22612de7-0dfa-11ef-baa2-faebddc39855';
  userId = '7090e9d8-0dfa-11ef-baa2-faebddc39855';
  showKeys = true;
  randomNumber: number | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  private getToken(): string | null {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      alert('Token missing. Please log in again.');
      sessionStorage.clear();
      this.router.navigate(['/login']);
      return null;
    }
    return token;
  }

  getUserKey(): void {
    const token = this.getToken();
    if (!token) return;

    const body = {
      domainId: this.domainId,
      id: this.userId
    };

    this.http.post<any>('http://localhost:9090/api/cloudstack/getUserKeys', body)
      .subscribe({
        next: (res) => {
          const userKeys = res.getuserkeysresponse?.userkeys;
          if (userKeys) {
            this.apiKey = userKeys.apikey;
            this.secretKey = userKeys.secretkey;
            this.showKeys = true;
          } else {
            alert('User keys not found.');
          }
        },
        error: () => alert('Failed to load user keys.')
      });
  }

  logout(): void {
    const token = this.getToken();
    if (!token) return;

    const confirmed = confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    this.http.get<any>('http://localhost:9090/api/cloudstack/logout')
      .subscribe({
        next: () => {
          sessionStorage.clear();
          this.router.navigate(['/login']);
        },
        error: () => {
          sessionStorage.clear();
          this.router.navigate(['/login']);
        }
      });
  }

  random(): void {
    const token = this.getToken();
    if (!token) return;

    this.http.get<number>('http://localhost:9090/api/cloudstack/random')
      .subscribe({
        next: (res) => this.randomNumber = res,
        error: () => alert('Failed to fetch random number.')
      });
  }
}
