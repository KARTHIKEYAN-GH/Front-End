// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
// import { Router, RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule, RouterModule],
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })
// export class DashboardComponent implements OnInit {
//   networks: any[] = [];
//   apiKey: string = '';
//   secretKey: string = '';
//   showKeys: boolean = false;
//   token: string | null = null;

//   domainId: string = '22612de7-0dfa-11ef-baa2-faebddc39855';
//   userId: string = '7090e9d8-0dfa-11ef-baa2-faebddc39855';

//   constructor(private http: HttpClient, private router: Router) {}

//   ngOnInit(): void {
//     this.token = localStorage.getItem('accessToken');
//     this.loadNetworks();
//   }

//   loadNetworks() {
//     if (this.token) {
//       const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
//       this.http.get<any[]>('http://localhost:9090/api/cloudstack/listNetworks', { headers })
//         .subscribe({
//           next: (data) => {
//             this.networks = data;
//           },
//           error: () => {
//             alert('Failed to load networks.');
//           }
//         });
//     } else {
//       alert('No access token found.');
//       this.router.navigate(['/login']);
//     }
//   }

//   getUserKey() {
//     if (!this.token) {
//       alert('No token found. Please login again.');
//       return;
//     }

//     const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

//     const body = {
//       domainId: this.domainId,
//       id: this.userId
//     };

//     this.http.post<any>('http://localhost:9090/api/cloudstack/getUserKeys', body, { headers })
//       .subscribe({
//         next: (data) => {
//           const userKeys = data.getuserkeysresponse?.userkeys;
//           if (userKeys) {
//             this.apiKey = userKeys.apikey;
//             this.secretKey = userKeys.secretkey;
//             this.showKeys = true;
//             console.log('API Key:', this.apiKey);
//             console.log('Secret Key:', this.secretKey);

//           } else {
//             alert('User keys not found in response.');
//           }
//         },
//         error: () => {
//           alert('Failed to load user keys.');
//         }
//       });
//   }

//   logout() {
//     const token = localStorage.getItem('accessToken');
//     this.http.get<any>('http://localhost:9090/api/cloudstack/logout', {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }).subscribe({
//       next: () => {
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('refreshToken');
//         this.router.navigate(['/login']);
//       },
//       error: () => {
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('refreshToken');
//         this.router.navigate(['/login']);
//       }
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  apiKey = '';
  secretKey = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {}

  getUserKey() {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const body = {
      domainId: '22612de7-0dfa-11ef-baa2-faebddc39855',
      id: '090e9d8-0dfa-11ef-baa2-faebddc39855'
    };

    this.http.post<any>('http://localhost:9090/api/cloudstack/getUserKeys', body, { headers })
      .subscribe({
        next: (res) => {
          const userKeys = res.getuserkeysresponse?.userkeys;
          this.apiKey = userKeys.apikey;
          this.secretKey = userKeys.secretkey;
        },
        error: () => alert('Failed to load user keys.')
      });
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }
}
