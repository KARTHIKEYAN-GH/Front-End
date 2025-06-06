import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  imports: [NgIf, NgFor], // import directives here
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  // component code
}


