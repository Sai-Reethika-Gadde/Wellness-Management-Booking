import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { trigger, transition, style, animate } from '@angular/animations'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0}),
        animate('500ms ease-out', style({  opacity:1 })),
      ]),
    ]),
  ],
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}
  
  login() {
    // Check if username and password are provided
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Please provide both username and password';
      return; // Exit the function if credentials are not provided
    }
  
    this.authService.login(this.credentials).subscribe(
      response => {
        console.log('Login Response:', response);
        this.router.navigate(['/dashboard']); // Navigate to dashboard on successful login
       
      },
      error => {
        console.error('Login Error:', error);
        this.errorMessage = 'Failed to login'; // Display a generic error message on error
      }
    );
  }
  
    
}
