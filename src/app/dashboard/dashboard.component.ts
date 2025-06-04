import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  networks: any[] = [];
  token: string | null = localStorage.getItem('accessToken');

  constructor(private http: HttpClient, private router: Router) {
    this.loadNetworks();
  }

  // loadNetworks() {
  //   this.http.get<any[]>('http://localhost:9090/api/cloudstack/listNetworks', {
  //     headers: { Authorization: `Bearer ${this.token}` }
  //   }).subscribe({
  //     next: (data) => {
  //       this.networks = data;
  //     },
  //     error: () => {
  //       alert('Failed to load networks.');
  //     }
  //   });
  // }

  
  loadNetworks() {
    if (this.token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      this.http.get<any[]>('http://localhost:9090/api/cloudstack/listNetworks', { headers })
        .subscribe({
          next: (data) => {
            this.networks = data;
          },
          error: () => {
            alert('Failed to load networks.');
          }
        });
    } else {
      alert('No access token found.');
    }
  }

  getUserKey(domainId: string, id: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const params = new HttpParams()
      .set('domainId', "22612de7-0dfa-11ef-baa2-faebddc39855")
      .set('id', "7090e9d8-0dfa-11ef-baa2-faebddc39855");
  
    this.http.get<any[]>('http://localhost:9090/api/cloudstack/getUserKeys', { headers, params })
      .subscribe({
        next: (data) => {
          this.networks = data;
        },
        error: () => {
          alert('Failed to load networks.');
        }
      });
  }
  

  logout() {
    const token = localStorage.getItem('accessToken');
    this.http.get<any>('http://localhost:9090/api/cloudstack/logout', {
      headers: {
        Authorization: `Bearer ${token}`
      } 
    }).subscribe({
      next: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['/login']);
      }
    });
  }
  
}
